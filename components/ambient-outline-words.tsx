"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"

import { endingLayerToggles } from "@/components/sections/ending-layer-toggles"
import { getLenis } from "@/components/smooth-scroll"
import { cn } from "@/lib/utils"

/**
 * Fixed, site-wide far-field outline words. They drift on their own,
 * get a gentle push from scroll velocity, and leave to re-enter from
 * another edge. Mounted once at the root, behind page content.
 */

const WORDS = [
  "BUILD",
  "CODE",
  "AI",
  "FULL-STACK",
  "TUTORING",
  "PROJECTS",
  "REACT",
  "PYTHON",
  "EXPERIENCE",
  "TYPESCRIPT",
  "FLUTTER",
  "CLOUD",
  "SYSTEMS",
  "AWS",
  "NEXT",
] as const

const COLORS = ["#a855f7", "#00FFF1", "#ff2975", "#0070F3"] as const

type Edge = "left" | "right" | "top" | "bottom"
type Travel = "horizontal" | "diagonal" | "drop"

type Walker = {
  el: HTMLSpanElement
  text: string
  x: number
  y: number
  baseVx: number
  baseVy: number
  width: number
  height: number
  baseOpacity: number
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function capacity() {
  if (typeof window === "undefined") return 1
  return window.innerWidth < 768 ? 1 : window.innerWidth >= 1280 ? 3 : 2
}

function isEndingPinned() {
  const track = document.querySelector("[data-ending-track]")
  if (!(track instanceof HTMLElement)) return false
  const rect = track.getBoundingClientRect()
  return rect.top <= 8 && rect.bottom > window.innerHeight * 0.45
}

function unusedWord(active: Set<string>, preferLong: boolean): string {
  const available = WORDS.filter((word) => !active.has(word))
  const long = available.filter((word) => word.length >= 5)
  const pool = preferLong && long.length > 0 ? long : available
  return pick(pool.length > 0 ? pool : WORDS)
}

function plan(
  vw: number,
  vh: number,
  w: number,
  h: number,
  prefer: Edge | null
): { x: number; y: number; vx: number; vy: number } {
  const travel: Travel =
    prefer === "top" || Math.random() < 0.28
      ? "drop"
      : Math.random() < 0.5
        ? "horizontal"
        : "diagonal"

  const pad = 48
  const duration = rand(20000, 38000)
  const midY = rand(vh * 0.12, Math.max(vh * 0.14, vh - h - vh * 0.12))
  const midX = rand(vw * 0.08, Math.max(vw * 0.1, vw - w - vw * 0.08))

  if (travel === "drop") {
    const drift = rand(-0.22, 0.22) * vw
    const dur = rand(22000, 40000)
    return {
      x: midX,
      y: -h - pad,
      vx: drift / dur,
      vy: (vh + h + pad * 2) / dur,
    }
  }

  const fromLeft =
    prefer === "left" ? true : prefer === "right" ? false : Math.random() < 0.5
  const startX = fromLeft ? -w - pad : vw + pad
  const endX = fromLeft ? vw + pad : -w - pad
  const startY = midY
  const endY =
    travel === "diagonal"
      ? Math.min(Math.max(midY + rand(-vh * 0.35, vh * 0.35), -h), vh)
      : midY + rand(-vh * 0.06, vh * 0.06)

  return {
    x: startX,
    y: startY,
    vx: (endX - startX) / duration,
    vy: (endY - startY) / duration,
  }
}

function styleWord(el: HTMLSpanElement) {
  const mobile = window.innerWidth < 768
  const size = mobile ? rand(22, 32) : rand(12, 20)
  const blur = mobile ? rand(1, 2) : rand(1, 3)
  const color = pick(COLORS)
  const tilt = rand(-8, 8)
  const opacity = mobile ? rand(0.09, 0.12) : rand(0.07, 0.12)
  el.className = cn(
    "pointer-events-none absolute top-0 left-0 font-heading font-bold uppercase leading-none whitespace-nowrap select-none",
    "will-change-transform text-transparent"
  )
  el.style.fontSize = `${size}vw`
  el.style.letterSpacing = `${rand(0.06, 0.14)}em`
  el.style.color = "transparent"
  el.style.webkitTextStroke = `${mobile ? "0.022em" : "0.012em"} ${color}`
  el.style.filter = `blur(${blur.toFixed(2)}px)`
  el.style.opacity = "0"
  el.dataset.tilt = String(tilt)
  return opacity
}

function applyTransform(
  walker: Walker,
  endingFade: number,
  vw: number,
  vh: number
) {
  const { el, x, y, width, height, baseOpacity } = walker
  const cx = x + width / 2
  const cy = y + height / 2
  const edge = Math.max(
    Math.min(1, Math.abs(cx / vw - 0.5) * 2),
    Math.min(1, Math.abs(cy / vh - 0.5) * 1.4) * 0.65
  )
  const dim = window.innerWidth < 768 ? 0.85 + 0.15 * edge : 0.7 + 0.3 * edge
  const tilt = Number(el.dataset.tilt ?? 0)
  el.style.opacity = String(baseOpacity * dim * endingFade)
  el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg)`
}

function isOffscreen(walker: Walker, vw: number, vh: number) {
  const pad = 64
  return (
    walker.x > vw + pad ||
    walker.x + walker.width < -pad ||
    walker.y > vh + pad ||
    walker.y + walker.height < -pad
  )
}

export function AmbientOutlineWords() {
  const reduced = useReducedMotion()
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!endingLayerToggles.ambientOutline) return
    if (reduced) return
    const layer = layerRef.current
    if (!layer) return

    const walkers: Walker[] = []
    const activeText = new Set<string>()
    const timeouts = new Set<number>()
    let pendingSpawns = 0
    let raf = 0
    let last = performance.now()
    let endingFade = 1
    let running = document.visibilityState !== "hidden"
    let scrollBoostX = 0
    let scrollBoostY = 0

    const spawn = (immediate: boolean, prefer: Edge | null) => {
      const el = document.createElement("span")
      el.setAttribute("aria-hidden", "true")
      const text = unusedWord(activeText, window.innerWidth < 768)
      el.textContent = text
      const opacity = styleWord(el)
      layer.appendChild(el)
      const walker: Walker = {
        el,
        text,
        x: 0,
        y: 0,
        baseVx: 0,
        baseVy: 0,
        width: 0,
        height: 0,
        baseOpacity: opacity,
      }
      walker.width = el.offsetWidth
      walker.height = el.offsetHeight
      const vw = window.innerWidth
      const vh = window.innerHeight
      const path = plan(vw, vh, walker.width, walker.height, prefer)
      walker.x = path.x
      walker.y = path.y
      walker.baseVx = path.vx
      walker.baseVy = path.vy
      if (immediate) {
        // Already in flight so the first paint is not empty.
        const ahead = rand(0.18, 0.52)
        walker.x += walker.baseVx * ahead * 28000
        walker.y += walker.baseVy * ahead * 28000
      }
      activeText.add(text)
      walkers.push(walker)
      applyTransform(walker, endingFade, vw, vh)
    }

    const retire = (walker: Walker) => {
      activeText.delete(walker.text)
      walker.el.remove()
      const index = walkers.indexOf(walker)
      if (index >= 0) walkers.splice(index, 1)
      pendingSpawns += 1
      const prefer: Edge | null =
        scrollBoostY > 0.02 ? "top" : scrollBoostX > 0.02 ? "left" : null
      const id = window.setTimeout(() => {
        timeouts.delete(id)
        pendingSpawns = Math.max(0, pendingSpawns - 1)
        if (!layer.isConnected) return
        if (walkers.length < capacity()) spawn(false, prefer)
      }, rand(700, 3200))
      timeouts.add(id)
    }

    const count = capacity()
    for (let i = 0; i < count; i += 1) {
      spawn(true, i === 0 ? "left" : i === 1 ? "right" : "top")
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (!running) {
        last = now
        return
      }
      const dt = Math.min(48, now - last)
      last = now
      const vw = window.innerWidth
      const vh = window.innerHeight
      const velocity = getLenis()?.velocity ?? 0
      // Lenis velocity is px-scale; keep the added push calm.
      const targetY = Math.max(-1.15, Math.min(1.15, velocity * 0.035))
      const targetX = Math.max(-0.45, Math.min(0.45, velocity * 0.01))
      scrollBoostY += (targetY - scrollBoostY) * 0.12
      scrollBoostX += (targetX - scrollBoostX) * 0.1
      const wantFade = isEndingPinned() ? 0 : 1
      endingFade += (wantFade - endingFade) * 0.06

      if (walkers.length + pendingSpawns < capacity()) {
        spawn(false, null)
      }

      for (const walker of [...walkers]) {
        walker.x += (walker.baseVx + scrollBoostX) * dt
        walker.y += (walker.baseVy + scrollBoostY) * dt
        applyTransform(walker, endingFade, vw, vh)
        if (isOffscreen(walker, vw, vh)) retire(walker)
      }
    }

    raf = requestAnimationFrame(tick)

    const onVisibility = () => {
      running = document.visibilityState !== "hidden"
      last = performance.now()
    }
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener("visibilitychange", onVisibility)
      for (const id of timeouts) window.clearTimeout(id)
      for (const walker of walkers) walker.el.remove()
      walkers.length = 0
    }
  }, [reduced])

  if (!endingLayerToggles.ambientOutline) return null

  if (reduced) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <span
          className="absolute top-[38%] left-[8%] font-heading text-[16vw] font-bold tracking-[0.12em] text-transparent uppercase leading-none select-none md:text-[12vw]"
          style={{
            WebkitTextStroke: "0.012em #a855f7",
            opacity: 0.08,
            filter: "blur(2px)",
          }}
        >
          BUILD
        </span>
      </div>
    )
  }

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    />
  )
}

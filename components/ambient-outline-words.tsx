"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"

import { useDepthLayers } from "@/components/depth-layer-provider"
import { getLenis } from "@/components/smooth-scroll"
import { cn } from "@/lib/utils"

/**
 * Far-field, site-wide outline words. Slow leftward cruise in the
 * outer gutters and top corners (about 0.25–0.35x), behind all content.
 * They stay out of the center reading column, get a gentle scroll
 * nudge, and re-enter from another edge. Paused when the tab is hidden.
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

type Edge = "left" | "right" | "top"
type Travel = "gutter-drop" | "gutter-rise" | "top-corner"

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

function gutterRatio(vw: number) {
  return vw < 768 ? 0.2 : 0.25
}

function leftGutterX(vw: number, w: number) {
  const gutter = vw * gutterRatio(vw)
  const cx = rand(-w * 0.2, gutter * 0.7)
  return cx - w / 2
}

function rightGutterX(vw: number, w: number) {
  const gutter = vw * gutterRatio(vw)
  const cx = rand(vw - gutter * 0.7, vw + w * 0.2)
  return cx - w / 2
}

function topCornerY(vh: number, h: number) {
  const cy = rand(vh * 0.04, vh * 0.2)
  return cy - h / 2
}

function plan(
  vw: number,
  vh: number,
  w: number,
  h: number,
  prefer: Edge | null
): { x: number; y: number; vx: number; vy: number } {
  const pad = 48
  // Far layer: slow. ~28–48s to cross a gutter or drop the viewport.
  const duration = rand(28000, 48000)
  const side: "left" | "right" =
    prefer === "left" ? "left" : prefer === "right" ? "right" : Math.random() < 0.5 ? "left" : "right"

  const kinds: Travel[] =
    prefer === "top"
      ? ["top-corner", "gutter-drop"]
      : prefer === "left" || prefer === "right"
        ? ["gutter-drop", "gutter-rise"]
        : ["gutter-drop", "gutter-rise", "top-corner"]
  const travel = pick(kinds)

  const startX = side === "left" ? leftGutterX(vw, w) : rightGutterX(vw, w)

  if (travel === "top-corner") {
    const y = topCornerY(vh, h)
    // Always cruise left (far-layer direction), staying in this corner.
    const drift = side === "left" ? rand(-gutterRatio(vw) * vw * 0.5, 0) : rand(-gutterRatio(vw) * vw * 0.8, 0)
    return { x: startX, y, vx: drift / duration, vy: rand(-0.004, 0.004) }
  }

  if (travel === "gutter-rise") {
    const x = startX
    const y = vh + pad
    return {
      x,
      y,
      vx: (side === "left" ? -1 : 1) * rand(0, 0.006),
      vy: -(vh + h + pad * 2) / duration,
    }
  }

  // gutter-drop (and default)
  return {
    x: startX,
    y: -h - pad,
    vx: (side === "left" ? -1 : 1) * rand(0, 0.006),
    vy: (vh + h + pad * 2) / duration,
  }
}

function styleWord(el: HTMLSpanElement) {
  const mobile = window.innerWidth < 768
  // Far layer: a little smaller, blurrier, fainter than mid/near layers.
  const size = mobile ? rand(16, 24) : rand(9, 14)
  const blur = mobile ? rand(1.5, 2.5) : rand(2, 3)
  const color = pick(COLORS)
  const tilt = rand(-8, 8)
  const opacity = mobile ? rand(0.08, 0.11) : rand(0.06, 0.1)
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
  const gutter = gutterRatio(vw)
  const inCenterX = Math.abs(cx / vw - 0.5) < 0.5 - gutter
  const inReadingY = cy / vh > 0.22 && cy / vh < 0.88
  const clearance = inCenterX && inReadingY ? 0.28 : 1
  const tilt = Number(el.dataset.tilt ?? 0)
  el.style.opacity = String(baseOpacity * clearance * endingFade)
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
  const { layers } = useDepthLayers()
  const layerRef = useRef<HTMLDivElement>(null)
  const outlineOnRef = useRef(layers.outlineWord)

  useEffect(() => {
    outlineOnRef.current = layers.outlineWord
  }, [layers.outlineWord])

  useEffect(() => {
    if (!layers.ambientOutline) return
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
        const ahead = rand(0.2, 0.55)
        walker.x += walker.baseVx * ahead * 36000
        walker.y += walker.baseVy * ahead * 36000
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
      const targetY = Math.max(-1.15, Math.min(1.15, velocity * 0.035))
      const targetX = Math.max(-0.45, Math.min(0.45, velocity * 0.01))
      scrollBoostY += (targetY - scrollBoostY) * 0.12
      scrollBoostX += (targetX - scrollBoostX) * 0.1
      // Only yield the ending if the beat-specific outline is also on.
      const wantFade = isEndingPinned() && outlineOnRef.current ? 0 : 1
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
  }, [reduced, layers.ambientOutline])

  if (!layers.ambientOutline) return null

  if (reduced) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <span
          className="absolute top-[8%] left-[1%] font-heading text-[14vw] font-bold tracking-[0.12em] text-transparent uppercase leading-none select-none md:text-[10vw]"
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

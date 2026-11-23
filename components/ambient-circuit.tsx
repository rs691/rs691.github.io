"use client"

import { useEffect, useRef } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"

import { useDepthLayers } from "@/components/depth-layer-provider"
import { getLenis } from "@/components/smooth-scroll"

const CELL = 32
const MAX_PULSES = 16
const MAX_GLOWS = 24
const SPAWN_MIN = 0.16
const SPAWN_MAX = 0.42

type Tone = "cyan" | "emerald" | "amber"

type Pulse = {
  axis: "x" | "y"
  lane: number
  from: number
  to: number
  head: number
  speed: number
  length: number
  tone: Tone
}

type Glow = {
  gx: number
  gy: number
  life: number
  tone: Tone
}

const TONES: Record<
  Tone,
  { dark: [number, number, number]; light: [number, number, number] }
> = {
  cyan: { dark: [34, 211, 238], light: [14, 116, 144] },
  emerald: { dark: [52, 211, 153], light: [4, 120, 87] },
  amber: { dark: [251, 191, 36], light: [180, 83, 9] },
}

function randInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function pickTone(): Tone {
  const roll = Math.random()
  if (roll < 0.22) return "amber"
  if (roll < 0.61) return "cyan"
  return "emerald"
}

function pickLane(count: number, favorEdges: boolean) {
  if (!favorEdges || count < 6 || Math.random() > 0.4) {
    return randInt(0, count - 1)
  }
  const edge = Math.max(2, Math.floor(count * 0.22))
  return Math.random() < 0.5
    ? randInt(0, edge)
    : randInt(count - 1 - edge, count - 1)
}

function spawnPulse(cols: number, rows: number): Pulse | null {
  if (cols < 4 || rows < 4) return null
  const axis: "x" | "y" = Math.random() < 0.5 ? "x" : "y"
  const span = axis === "x" ? cols : rows
  const cross = axis === "x" ? rows : cols
  const length = randInt(6, 14)
  if (span <= length + 1) return null
  const start = randInt(0, span - 1 - length)
  const end = start + length
  const forward = Math.random() < 0.5
  return {
    axis,
    lane: pickLane(cross, true),
    from: forward ? start : end,
    to: forward ? end : start,
    head: forward ? start : end,
    speed: (5.5 + Math.random() * 3.5) * (forward ? 1 : -1),
    length,
    tone: pickTone(),
  }
}

function rgba(tone: Tone, dark: boolean, alpha: number) {
  const [r, g, b] = dark ? TONES[tone].dark : TONES[tone].light
  return `rgba(${r},${g},${b},${alpha})`
}

function isDarkTheme() {
  return document.documentElement.classList.contains("dark")
}

/**
 * Occasional circuit traces and node glows, drawn on a DPR-aware canvas
 * sized to the same wrapper as the CSS dot grid so they stay aligned.
 * Caps pulse count, pauses when the tab is hidden, and speeds up a little
 * with Lenis scroll velocity.
 */
function CircuitPulses() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let cssW = 0
    let cssH = 0
    let cols = 0
    let rows = 0
    let running = document.visibilityState !== "hidden"
    let raf = 0
    let last = performance.now()
    let spawnIn = SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN)
    const pulses: Pulse[] = []
    const glows: Glow[] = []

    const resize = () => {
      cssW = parent.clientWidth
      cssH = parent.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(cssW * dpr))
      canvas.height = Math.max(1, Math.floor(cssH * dpr))
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.max(1, Math.ceil(cssW / CELL))
      rows = Math.max(1, Math.ceil(cssH / CELL))
    }

    const addGlow = (gx: number, gy: number, tone: Tone) => {
      const existing = glows.find((g) => g.gx === gx && g.gy === gy)
      if (existing) {
        existing.life = Math.min(1, existing.life + 0.7)
        existing.tone = tone
        return
      }
      glows.push({ gx, gy, life: 1, tone })
      if (glows.length > MAX_GLOWS) glows.shift()
    }

    const draw = () => {
      ctx.clearRect(0, 0, cssW, cssH)
      const dark = isDarkTheme()

      for (const glow of glows) {
        const x = (glow.gx + 0.5) * CELL
        const y = (glow.gy + 0.5) * CELL
        const radius = dark ? 11 : 9
        const grd = ctx.createRadialGradient(x, y, 0, x, y, radius)
        const peak = (dark ? 0.55 : 0.32) * glow.life
        grd.addColorStop(0, rgba(glow.tone, dark, peak))
        grd.addColorStop(1, rgba(glow.tone, dark, 0))
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const pulse of pulses) {
        const dir = pulse.to >= pulse.from ? 1 : -1
        const head = pulse.head
        const tail = head - dir * Math.min(pulse.length * 0.55, Math.abs(head - pulse.from))
        const along = (pos: number) =>
          pulse.axis === "x"
            ? { x: (pos + 0.5) * CELL, y: (pulse.lane + 0.5) * CELL }
            : { x: (pulse.lane + 0.5) * CELL, y: (pos + 0.5) * CELL }
        const a = along(tail)
        const b = along(head)
        const grd = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        grd.addColorStop(0, rgba(pulse.tone, dark, 0))
        grd.addColorStop(0.55, rgba(pulse.tone, dark, dark ? 0.28 : 0.2))
        grd.addColorStop(1, rgba(pulse.tone, dark, dark ? 0.85 : 0.55))
        ctx.strokeStyle = grd
        ctx.lineWidth = dark ? 1.4 : 1.15
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()

        ctx.fillStyle = rgba(pulse.tone, dark, dark ? 0.95 : 0.7)
        ctx.beginPath()
        ctx.arc(b.x, b.y, dark ? 1.8 : 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (!running) {
        last = now
        return
      }
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const vel = Math.abs(getLenis()?.velocity ?? 0)
      const boost = 1 + Math.min(vel / 1.8, 1.15)

      spawnIn -= dt
      if (spawnIn <= 0 && pulses.length < MAX_PULSES) {
        const pulse = spawnPulse(cols, rows)
        if (pulse) pulses.push(pulse)
        spawnIn = SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN)
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i]
        const prev = pulse.head
        pulse.head += pulse.speed * boost * dt
        const lo = Math.min(pulse.from, pulse.to)
        const hi = Math.max(pulse.from, pulse.to)
        const crossed = Math.trunc(prev) !== Math.trunc(pulse.head)
        if (crossed) {
          if (pulse.axis === "x") {
            addGlow(Math.round(pulse.head), pulse.lane, pulse.tone)
          } else {
            addGlow(pulse.lane, Math.round(pulse.head), pulse.tone)
          }
        }
        if (pulse.head < lo - 0.2 || pulse.head > hi + 0.2) {
          pulses.splice(i, 1)
        }
      }

      for (let i = glows.length - 1; i >= 0; i--) {
        glows[i].life -= dt * 1.35
        if (glows[i].life <= 0) glows.splice(i, 1)
      }

      draw()
    }

    const onVisibility = () => {
      running = document.visibilityState !== "hidden"
      last = performance.now()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    document.addEventListener("visibilitychange", onVisibility)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    />
  )
}

/**
 * Deepest site-wide field: a faint emerald / cyan dot grid with occasional
 * amber-accent circuit pulses. Drifts at about 0.25x behind the glyph bands.
 * Light mode uses darker dots and quieter pulses so nothing blows out.
 */
export function AmbientCircuit() {
  const reduced = useReducedMotion()
  const { layers } = useDepthLayers()
  const { scrollYProgress } = useScroll()
  const progress = useMotionValue(0)

  useEffect(() => {
    const sync = (value: number) => {
      if (document.visibilityState !== "hidden") progress.set(value)
    }
    sync(scrollYProgress.get())
    const unsub = scrollYProgress.on("change", sync)
    const onVisibility = () => {
      if (document.visibilityState !== "hidden") {
        progress.set(scrollYProgress.get())
      }
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      unsub()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [scrollYProgress, progress])

  const y = useTransform(progress, [0, 1], ["8vh", "-16vh"])

  if (layers.background !== "circuit") return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <motion.div
        style={reduced ? undefined : { y }}
        className="absolute inset-[-24%] will-change-transform"
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,118,110,0.2)_1px,transparent_1.15px)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(52,211,153,0.15)_1px,transparent_1.15px)]"
          style={{ backgroundSize: `${CELL}px ${CELL}px` }}
        />
        {reduced ? null : <CircuitPulses />}
      </motion.div>
    </div>
  )
}

"use client"

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"

import { endingLayerToggles } from "@/components/sections/ending-layer-toggles"
import { cn } from "@/lib/utils"

type GlyphSpec = {
  text: string
  speed: number
  rotate: readonly [number, number]
  className: string
  color: string
  opacity: number
  size: string
  desktopOnly?: boolean
  blur?: number
  rest?: boolean
}

/**
 * Near-field code glyphs that travel faster than the pinned ending
 * so the mid-layer cards feel deeper. A slower, blurrier back set sits
 * behind the sharp glyphs. Kept at the edges so they never sit on
 * testimonials, the closer heading, or the footer. A few ease to rest
 * at the last screen so that beat is not empty.
 */
const GLYPHS: GlyphSpec[] = [
  {
    text: "{ }",
    speed: 1.45,
    rotate: [-10, 8],
    className: "top-[16%] left-[3%] md:left-[4%]",
    color: "#a855f7",
    opacity: 0.38,
    size: "text-2xl md:text-5xl",
    rest: true,
  },
  {
    text: "</>",
    speed: 1.62,
    rotate: [8, -12],
    className: "top-[22%] right-[3%] md:right-[5%]",
    color: "#00FFF1",
    opacity: 0.34,
    size: "text-xl md:text-4xl",
  },
  {
    text: "=>",
    speed: 1.74,
    rotate: [-6, 14],
    className: "top-[58%] left-[2%] md:left-[3%]",
    color: "#ff2975",
    opacity: 0.32,
    size: "text-2xl md:text-5xl",
    rest: true,
  },
  {
    text: "()",
    speed: 1.5,
    rotate: [12, -6],
    className: "top-[62%] right-[2%] hidden md:block md:right-[4%]",
    color: "#0070F3",
    opacity: 0.3,
    size: "text-4xl",
    desktopOnly: true,
    rest: true,
  },
  {
    text: ";",
    speed: 1.8,
    rotate: [-14, 10],
    className: "top-[38%] right-[7%] hidden md:block",
    color: "#a855f7",
    opacity: 0.28,
    size: "text-6xl",
    desktopOnly: true,
  },
  // Slower, blurrier back set — reads as farther than the sharp glyphs.
  {
    text: "#",
    speed: 1.16,
    rotate: [6, -8],
    className: "top-[8%] left-[9%] md:left-[11%]",
    color: "#0070F3",
    opacity: 0.2,
    size: "text-3xl md:text-6xl",
    blur: 2,
  },
  {
    text: "[]",
    speed: 1.22,
    rotate: [-8, 6],
    className: "top-[48%] right-[1%] hidden md:block md:right-[2%]",
    color: "#00FFF1",
    opacity: 0.18,
    size: "text-5xl",
    desktopOnly: true,
    blur: 1.75,
  },
  {
    text: "&&",
    speed: 1.28,
    rotate: [10, -4],
    className: "top-[76%] left-[5%] hidden md:block",
    color: "#ff2975",
    opacity: 0.18,
    size: "text-4xl",
    desktopOnly: true,
    blur: 1.5,
    rest: true,
  },
]

function Glyph({
  text,
  speed,
  rotate,
  className,
  color,
  opacity,
  size,
  blur = 0,
  rest = false,
  progress,
}: GlyphSpec & { progress: MotionValue<number> }) {
  // Mid-layer travel in this pin is effectively 0 (sticky cards). A
  // 1.0x "page" unit is treated as 52vh; faster glyphs travel farther.
  // Range is centered so they sit at their edge positions mid-sequence.
  // Resting glyphs flatten to their CSS edge slot by the last beat.
  const travel = 52 * speed
  const y = useTransform(
    progress,
    rest ? [0, 0.68, 0.9, 1] : [0, 1],
    rest
      ? [`${travel * 0.5}vh`, `${-travel * 0.16}vh`, "0vh", "0vh"]
      : [`${travel * 0.5}vh`, `${-travel * 0.5}vh`]
  )
  const rotateZ = useTransform(
    progress,
    rest ? [0, 0.9, 1] : [0, 1],
    rest ? [rotate[0], rotate[1] * 0.35, rotate[1] * 0.35] : [...rotate]
  )

  return (
    <motion.span
      aria-hidden
      style={{
        y,
        rotate: rotateZ,
        color,
        opacity,
        filter: blur ? `blur(${blur}px)` : undefined,
        textShadow: `0 0 18px ${color}99, 0 0 36px ${color}55`,
      }}
      className={cn(
        "pointer-events-none absolute font-mono font-semibold leading-none select-none will-change-transform",
        size,
        className
      )}
    >
      {text}
    </motion.span>
  )
}

export function EndingForegroundGlyphs({
  progress,
}: {
  progress: MotionValue<number>
}) {
  const reduced = useReducedMotion()

  if (!endingLayerToggles.foregroundGlyphs || reduced) {
    return null
  }

  const back = GLYPHS.filter((glyph) => (glyph.blur ?? 0) > 0)
  const front = GLYPHS.filter((glyph) => !(glyph.blur ?? 0))

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
      >
        {back.map((glyph) => (
          <Glyph key={glyph.text} {...glyph} progress={progress} />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      >
        {front.map((glyph) => (
          <Glyph key={glyph.text} {...glyph} progress={progress} />
        ))}
      </div>
    </>
  )
}

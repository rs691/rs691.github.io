"use client"

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"

import { endingLayerToggles } from "@/components/sections/ending-layer-toggles"
import { cn } from "@/lib/utils"

/**
 * Near-field code glyphs that travel faster than the pinned ending
 * (about 1.4x–1.8x) so the mid-layer cards feel deeper. Kept at the
 * edges so they never sit on testimonials, the closer heading, or the footer.
 */
const GLYPHS = [
  {
    text: "{ }",
    speed: 1.45,
    rotate: [-10, 8] as const,
    className: "top-[16%] left-[3%] md:left-[4%]",
    color: "#a855f7",
    opacity: 0.38,
    size: "text-2xl md:text-5xl",
  },
  {
    text: "</>",
    speed: 1.62,
    rotate: [8, -12] as const,
    className: "top-[22%] right-[3%] md:right-[5%]",
    color: "#00FFF1",
    opacity: 0.34,
    size: "text-xl md:text-4xl",
  },
  {
    text: "=>",
    speed: 1.74,
    rotate: [-6, 14] as const,
    className: "top-[58%] left-[2%] md:left-[3%]",
    color: "#ff2975",
    opacity: 0.32,
    size: "text-2xl md:text-5xl",
  },
  {
    text: "()",
    speed: 1.5,
    rotate: [12, -6] as const,
    className: "top-[62%] right-[2%] hidden md:block md:right-[4%]",
    color: "#0070F3",
    opacity: 0.3,
    size: "text-4xl",
    desktopOnly: true,
  },
  {
    text: ";",
    speed: 1.8,
    rotate: [-14, 10] as const,
    className: "top-[38%] right-[7%] hidden md:block",
    color: "#a855f7",
    opacity: 0.28,
    size: "text-6xl",
    desktopOnly: true,
  },
] as const

function Glyph({
  text,
  speed,
  rotate,
  className,
  color,
  opacity,
  size,
  progress,
}: (typeof GLYPHS)[number] & { progress: MotionValue<number> }) {
  // Mid-layer travel in this pin is effectively 0 (sticky cards). A
  // 1.0x "page" unit is treated as 52vh; faster glyphs travel farther.
  // Range is centered so they sit at their edge positions mid-sequence.
  const travel = 52 * speed
  const y = useTransform(progress, [0, 1], [`${travel * 0.5}vh`, `${-travel * 0.5}vh`])
  const rotateZ = useTransform(progress, [0, 1], [...rotate])

  return (
    <motion.span
      aria-hidden
      style={{
        y,
        rotate: rotateZ,
        color,
        opacity,
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

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      {GLYPHS.map((glyph) => (
        <Glyph key={glyph.text} {...glyph} progress={progress} />
      ))}
    </div>
  )
}

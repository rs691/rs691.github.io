"use client"

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"

import { endingLayerToggles } from "@/components/sections/ending-layer-toggles"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

type WordSpec = {
  text: string
  color: string
  /** Horizontal drift vs the pinned mid-layer, about 0.3x–0.5x. */
  speed: number
  /** 1 travels left-to-right; -1 travels right-to-left. */
  direction: 1 | -1
  opacityInput: readonly number[]
  opacityOutput: readonly number[]
  className?: string
}

/**
 * Far-field outlined type behind the cards and above the aurora.
 * Words crossfade by beat and drift slowly sideways so the mid-layer
 * cards read with more depth. Opacity stays low so quotes stay readable.
 */
const WORDS: WordSpec[] = [
  {
    text: "TUTORING",
    color: "#a855f7",
    speed: 0.38,
    direction: 1,
    // Intro holds 0–0.2, then yields to TESTIMONIALS.
    opacityInput: [0, 0.14, 0.24, 0.3],
    opacityOutput: [0.1, 0.1, 0, 0],
    className: "tracking-[0.14em] text-[22vw] md:text-[15vw]",
  },
  {
    text: "TESTIMONIALS",
    color: "#00FFF1",
    speed: 0.46,
    direction: -1,
    // Quotes occupy 0.2–0.8.
    opacityInput: [0.16, 0.26, 0.74, 0.86],
    opacityOutput: [0, 0.16, 0.16, 0],
    className: "tracking-[0.06em] text-[18vw] md:text-[12.5vw]",
  },
  {
    text: siteConfig.footer.videoText,
    color: "#a855f7",
    speed: 0.32,
    direction: 1,
    // Faint texture around the landing heading; stays well below it in contrast.
    opacityInput: [0.8, 0.9, 1],
    opacityOutput: [0, 0.1, 0.08],
    className: "tracking-[0.16em] text-[20vw] md:text-[14vw]",
  },
]

function OutlineWord({
  text,
  color,
  speed,
  direction,
  opacityInput,
  opacityOutput,
  className,
  progress,
}: WordSpec & { progress: MotionValue<number> }) {
  const travel = 36 * speed
  const x = useTransform(progress, [0, 1], [
    `${-direction * travel * 0.5}vw`,
    `${direction * travel * 0.5}vw`,
  ])
  const opacity = useTransform(progress, [...opacityInput], [...opacityOutput])

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.span
        aria-hidden
        style={{
          x,
          opacity,
          color: "transparent",
          WebkitTextStroke: `0.012em ${color}`,
        }}
        className={cn(
          "font-heading font-bold uppercase leading-none whitespace-nowrap select-none will-change-transform",
          className
        )}
      >
        {text}
      </motion.span>
    </div>
  )
}

export function EndingOutlineWord({
  progress,
}: {
  progress: MotionValue<number>
}) {
  const reduced = useReducedMotion()

  if (!endingLayerToggles.outlineWord) {
    return null
  }

  // Static, very faint texture so reduced-motion users still get the
  // layer without any drift. Hidden entirely if the toggle is off.
  if (reduced) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-heading text-[18vw] font-bold tracking-[0.14em] text-transparent uppercase leading-none whitespace-nowrap md:text-[15vw]"
            style={{ WebkitTextStroke: "0.012em #a855f7", opacity: 0.08 }}
          >
            TUTORING
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      {WORDS.map((word) => (
        <OutlineWord key={word.text} {...word} progress={progress} />
      ))}
    </div>
  )
}

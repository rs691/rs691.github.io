"use client"

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"

import { useDepthLayers } from "@/components/depth-layer-provider"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

type WordSpec = {
  text: string
  color: string
  /** Mid-layer rightward drift, about 0.40x–0.55x. */
  speed: number
  opacityInput: readonly number[]
  opacityOutput: readonly number[]
  className?: string
}

/**
 * Mid-field outlined type for the ending pin, parked in the top band
 * so the center reading column (quotes, landing heading) stays clear.
 * All words drift right, opposite the far ambient layer's left cruise.
 */
const WORDS: WordSpec[] = [
  {
    text: "TUTORING",
    color: "#a855f7",
    speed: 0.42,
    opacityInput: [0, 0.14, 0.24, 0.3],
    opacityOutput: [0.1, 0.1, 0, 0],
    className: "tracking-[0.14em] text-[18vw] md:text-[12vw]",
  },
  {
    text: "TESTIMONIALS",
    color: "#00FFF1",
    speed: 0.5,
    opacityInput: [0.16, 0.26, 0.74, 0.86],
    opacityOutput: [0, 0.12, 0.12, 0],
    className: "tracking-[0.06em] text-[16vw] md:text-[11vw]",
  },
  {
    text: siteConfig.footer.videoText,
    color: "#a855f7",
    speed: 0.4,
    opacityInput: [0.8, 0.9, 1],
    opacityOutput: [0, 0.1, 0.08],
    className: "tracking-[0.16em] text-[16vw] md:text-[11vw]",
  },
]

function OutlineWord({
  text,
  color,
  speed,
  opacityInput,
  opacityOutput,
  className,
  progress,
}: WordSpec & { progress: MotionValue<number> }) {
  const travel = 36 * speed
  const x = useTransform(progress, [0, 1], [
    `${-travel * 0.5}vw`,
    `${travel * 0.5}vw`,
  ])
  const opacity = useTransform(progress, [...opacityInput], [...opacityOutput])

  return (
    <div className="absolute inset-x-0 top-[10%] flex justify-center md:top-[12%]">
      <motion.span
        aria-hidden
        style={{
          x,
          opacity,
          color: "transparent",
          WebkitTextStroke: `0.012em ${color}`,
          filter: "blur(0.6px)",
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
  const { layers } = useDepthLayers()

  if (!layers.outlineWord) return null

  if (reduced) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      >
        <div className="absolute inset-x-0 top-[10%] flex justify-center md:top-[12%]">
          <span
            className="font-heading text-[16vw] font-bold tracking-[0.14em] text-transparent uppercase leading-none whitespace-nowrap md:text-[12vw]"
            style={{
              WebkitTextStroke: "0.012em #a855f7",
              opacity: 0.08,
              filter: "blur(0.6px)",
            }}
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

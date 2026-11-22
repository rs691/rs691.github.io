"use client"

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"

import { useDepthLayers } from "@/components/depth-layer-provider"
import { cn } from "@/lib/utils"

type GlyphDir = "rise" | "fall" | "right"
type GlyphLayer = "back" | "front"

type GlyphSpec = {
  text: string
  speed: number
  dir: GlyphDir
  layer: GlyphLayer
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
 * Ending glyphs, split into a slower rising back set and a faster
 * falling / right-drifting front set. Parked in the outer gutters so
 * they never sit on testimonials, the closer heading, or the footer.
 * A few ease to rest at the last screen so that beat is not empty.
 */
const GLYPHS: GlyphSpec[] = [
  {
    text: "{ }",
    speed: 1.48,
    dir: "right",
    layer: "front",
    rotate: [-10, 8],
    className: "top-[10%] left-[1%] md:left-[1.5%]",
    color: "#a855f7",
    opacity: 0.38,
    size: "text-2xl md:text-5xl",
    rest: true,
  },
  {
    text: "</>",
    speed: 1.62,
    dir: "fall",
    layer: "front",
    rotate: [8, -12],
    className: "top-[18%] right-[1%] md:right-[1.5%]",
    color: "#00FFF1",
    opacity: 0.34,
    size: "text-xl md:text-4xl",
  },
  {
    text: "=>",
    speed: 1.72,
    dir: "fall",
    layer: "front",
    rotate: [-6, 14],
    className: "top-[72%] left-[1%] md:left-[1.5%]",
    color: "#ff2975",
    opacity: 0.32,
    size: "text-2xl md:text-5xl",
    rest: true,
  },
  {
    text: "()",
    speed: 1.52,
    dir: "right",
    layer: "front",
    rotate: [12, -6],
    className: "top-[70%] right-[1%] hidden md:block",
    color: "#0070F3",
    opacity: 0.3,
    size: "text-4xl",
    desktopOnly: true,
    rest: true,
  },
  {
    text: ";",
    speed: 1.85,
    dir: "fall",
    layer: "front",
    rotate: [-14, 10],
    className: "top-[38%] right-[1%] hidden md:block",
    color: "#a855f7",
    opacity: 0.28,
    size: "text-5xl md:text-6xl",
    desktopOnly: true,
  },
  {
    text: "#",
    speed: 0.74,
    dir: "rise",
    layer: "back",
    rotate: [6, -8],
    className: "top-[5%] left-[1%] md:left-[1.5%]",
    color: "#0070F3",
    opacity: 0.2,
    size: "text-xl md:text-4xl",
    blur: 2.2,
  },
  {
    text: "[]",
    speed: 0.86,
    dir: "rise",
    layer: "back",
    rotate: [-8, 6],
    className: "top-[78%] right-[1%] hidden md:block",
    color: "#00FFF1",
    opacity: 0.18,
    size: "text-4xl",
    desktopOnly: true,
    blur: 2,
  },
  {
    text: "&&",
    speed: 0.92,
    dir: "rise",
    layer: "back",
    rotate: [10, -4],
    className: "top-[6%] right-[1.5%] hidden md:block",
    color: "#ff2975",
    opacity: 0.16,
    size: "text-3xl",
    desktopOnly: true,
    blur: 1.8,
    rest: true,
  },
]

function Glyph({
  text,
  speed,
  dir,
  rotate,
  className,
  color,
  opacity,
  size,
  blur = 0,
  rest = false,
  progress,
}: GlyphSpec & { progress: MotionValue<number> }) {
  const travelY = 40 * speed
  const travelX = 16 * speed
  const times = rest ? [0, 0.68, 0.9, 1] : [0, 1]

  const yValues =
    dir === "rise"
      ? rest
        ? [`${travelY * 0.45}vh`, `${-travelY * 0.12}vh`, "0vh", "0vh"]
        : [`${travelY * 0.5}vh`, `${-travelY * 0.5}vh`]
      : dir === "fall"
        ? rest
          ? [`${-travelY * 0.45}vh`, `${travelY * 0.12}vh`, "0vh", "0vh"]
          : [`${-travelY * 0.5}vh`, `${travelY * 0.5}vh`]
        : rest
          ? [`${-travelY * 0.08}vh`, `${travelY * 0.04}vh`, "0vh", "0vh"]
          : [`${-travelY * 0.1}vh`, `${travelY * 0.1}vh`]

  const xValues =
    dir === "right"
      ? rest
        ? [`${-travelX * 0.4}vw`, `${travelX * 0.1}vw`, "0vw", "0vw"]
        : [`${-travelX * 0.45}vw`, `${travelX * 0.45}vw`]
      : dir === "rise"
        ? rest
          ? [`${travelX * 0.15}vw`, `${-travelX * 0.08}vw`, "0vw", "0vw"]
          : [`${travelX * 0.2}vw`, `${-travelX * 0.2}vw`]
        : rest
          ? ["0vw", "0vw", "0vw", "0vw"]
          : ["0vw", "0vw"]

  const y = useTransform(progress, times, yValues)
  const x = useTransform(progress, times, xValues)
  const rotateZ = useTransform(
    progress,
    rest ? [0, 0.9, 1] : [0, 1],
    rest ? [rotate[0], rotate[1] * 0.35, rotate[1] * 0.35] : [...rotate]
  )

  return (
    <motion.span
      aria-hidden
      style={{
        x,
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
  const { layers } = useDepthLayers()

  if (reduced) return null
  if (!layers.backGlyphs && !layers.frontGlyphs) return null

  const back = GLYPHS.filter((glyph) => glyph.layer === "back")
  const front = GLYPHS.filter((glyph) => glyph.layer === "front")

  return (
    <>
      {layers.backGlyphs ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
        >
          {back.map((glyph) => (
            <Glyph key={glyph.text} {...glyph} progress={progress} />
          ))}
        </div>
      ) : null}
      {layers.frontGlyphs ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
        >
          {front.map((glyph) => (
            <Glyph key={glyph.text} {...glyph} progress={progress} />
          ))}
        </div>
      ) : null}
    </>
  )
}

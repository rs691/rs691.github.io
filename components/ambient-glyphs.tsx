"use client"

import { useEffect } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

import { useDepthLayers } from "@/components/depth-layer-provider"
import { cn } from "@/lib/utils"

type Band = "far" | "mid" | "near"
type Dir = "up-left" | "up-right" | "side-right" | "fall" | "fall-left"

type GlyphSpec = {
  text: string
  band: Band
  speed: number
  dir: Dir
  rotate: readonly [number, number]
  className: string
  tone: "purple" | "cyan" | "pink" | "blue"
  rest?: boolean
}

/**
 * Site-wide gutter glyphs in three depth bands. Far is slow, small, and
 * blurry (up + left); mid travels about with the page (up + right or
 * sideways); near is large, sharp, and fast (falling or opposite).
 * Parked in the shoulders, closer to the content column. A soft
 * center mask keeps them faint where they sit behind body text.
 * A few ease to rest on the last screen.
 */
const GLYPHS: GlyphSpec[] = [
  {
    text: "#",
    band: "far",
    speed: 0.48,
    dir: "up-left",
    rotate: [8, -10],
    className: "top-[10%] left-[8%]",
    tone: "blue",
  },
  {
    text: "[]",
    band: "far",
    speed: 0.54,
    dir: "up-left",
    rotate: [-6, 8],
    className: "top-[50%] left-[10%] hidden md:block",
    tone: "cyan",
  },
  {
    text: "//",
    band: "far",
    speed: 0.58,
    dir: "up-left",
    rotate: [10, -4],
    className: "top-[78%] right-[9%] hidden md:block",
    tone: "purple",
  },
  {
    text: "()",
    band: "mid",
    speed: 0.98,
    dir: "side-right",
    rotate: [-8, 6],
    className: "top-[16%] right-[8%]",
    tone: "blue",
  },
  {
    text: "&&",
    band: "mid",
    speed: 1.05,
    dir: "up-right",
    rotate: [7, -9],
    className: "top-[58%] left-[7%] hidden md:block",
    tone: "pink",
  },
  {
    text: "<>",
    band: "mid",
    speed: 1.1,
    dir: "up-right",
    rotate: [-4, 10],
    className: "top-[38%] right-[11%] hidden md:block",
    tone: "cyan",
  },
  {
    text: "{ }",
    band: "near",
    speed: 1.58,
    dir: "fall",
    rotate: [-10, 8],
    className: "top-[14%] left-[11%]",
    tone: "purple",
    rest: true,
  },
  {
    text: "</>",
    band: "near",
    speed: 1.7,
    dir: "fall",
    rotate: [8, -12],
    className: "top-[22%] right-[12%] hidden md:block",
    tone: "cyan",
  },
  {
    text: "=>",
    band: "near",
    speed: 1.76,
    dir: "fall-left",
    rotate: [-6, 14],
    className: "top-[70%] left-[9%]",
    tone: "pink",
    rest: true,
  },
  {
    text: ";",
    band: "near",
    speed: 1.85,
    dir: "fall",
    rotate: [-14, 10],
    className: "top-[44%] right-[8%] hidden md:block",
    tone: "purple",
    rest: true,
  },
]

const TONE_CLASS = {
  purple: "text-violet-700 dark:text-violet-300",
  cyan: "text-teal-700 dark:text-cyan-300",
  pink: "text-rose-700 dark:text-pink-400",
  blue: "text-blue-800 dark:text-blue-400",
} as const

const BAND_CLASS: Record<Band, string> = {
  far: "text-3xl md:text-5xl opacity-[0.20] blur-[2.5px] dark:opacity-[0.16]",
  mid: "text-5xl md:text-7xl opacity-[0.22] blur-[0.7px] dark:opacity-[0.20]",
  near: "text-6xl md:text-8xl opacity-[0.24] dark:opacity-[0.22] dark:[text-shadow:0_0_18px_currentColor]",
}

const BAND_Z: Record<Band, string> = {
  far: "z-[1]",
  mid: "z-[2]",
  near: "z-[3]",
}

const BAND_TOGGLE = {
  far: "farGlyphs",
  mid: "midGlyphs",
  near: "nearGlyphs",
} as const

function travelValues(dir: Dir, speed: number, rest: boolean) {
  const unit = 80
  const ty = unit * speed
  const tx = 4 * speed
  const times = rest ? [0, 0.86, 0.96, 1] : [0, 1]

  const y =
    dir === "up-left" || dir === "up-right"
      ? rest
        ? [`${ty * 0.4}vh`, `${-ty * 0.1}vh`, "0vh", "0vh"]
        : [`${ty * 0.5}vh`, `${-ty * 0.5}vh`]
      : dir === "side-right"
        ? rest
          ? [`${-ty * 0.08}vh`, `${ty * 0.04}vh`, "0vh", "0vh"]
          : [`${-ty * 0.12}vh`, `${ty * 0.12}vh`]
        : rest
          ? [`${-ty * 0.4}vh`, `${ty * 0.1}vh`, "0vh", "0vh"]
          : [`${-ty * 0.5}vh`, `${ty * 0.5}vh`]

  const x =
    dir === "up-left" || dir === "fall-left"
      ? rest
        ? [`${tx * 0.35}vw`, `${-tx * 0.08}vw`, "0vw", "0vw"]
        : [`${tx * 0.45}vw`, `${-tx * 0.45}vw`]
      : dir === "up-right" || dir === "side-right"
        ? rest
          ? [`${-tx * 0.35}vw`, `${tx * 0.08}vw`, "0vw", "0vw"]
          : [`${-tx * 0.45}vw`, `${tx * 0.45}vw`]
        : rest
          ? [`${-tx * 0.1}vw`, `${tx * 0.06}vw`, "0vw", "0vw"]
          : [`${-tx * 0.15}vw`, `${tx * 0.15}vw`]

  return { times, x, y }
}

function Glyph({
  text,
  speed,
  dir,
  rotate,
  className,
  tone,
  rest = false,
  band,
  progress,
}: GlyphSpec & { progress: MotionValue<number> }) {
  const { times, x, y } = travelValues(dir, speed, rest)
  const xMv = useTransform(progress, times, x)
  const yMv = useTransform(progress, times, y)
  const rotateZ = useTransform(
    progress,
    rest ? [0, 0.96, 1] : [0, 1],
    rest ? [rotate[0], rotate[1] * 0.35, rotate[1] * 0.35] : [...rotate]
  )

  return (
    <motion.span
      aria-hidden
      style={{ x: xMv, y: yMv, rotate: rotateZ }}
      className={cn(
        "pointer-events-none absolute font-mono font-semibold leading-none select-none will-change-transform",
        TONE_CLASS[tone],
        BAND_CLASS[band],
        className
      )}
    >
      {text}
    </motion.span>
  )
}

function StaticGlyphs() {
  const statics = GLYPHS.filter(
    (glyph) => glyph.rest || !glyph.className.includes("hidden")
  ).slice(0, 3)
  return (
    <>
      {statics.map((glyph) => (
        <span
          key={glyph.text}
          aria-hidden
          className={cn(
            "pointer-events-none absolute font-mono font-semibold leading-none select-none",
            TONE_CLASS[glyph.tone],
            BAND_CLASS[glyph.band],
            glyph.className
          )}
        >
          {glyph.text}
        </span>
      ))}
    </>
  )
}

export function AmbientGlyphs() {
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

  const enabled = layers.farGlyphs || layers.midGlyphs || layers.nearGlyphs
  if (!enabled) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden [mask-image:linear-gradient(to_right,black_0%,black_16%,rgba(0,0,0,0.28)_32%,rgba(0,0,0,0.28)_68%,black_84%,black_100%)]"
    >
      {reduced ? (
        <StaticGlyphs />
      ) : (
        (["far", "mid", "near"] as const).map((band) =>
          layers[BAND_TOGGLE[band]] ? (
            <div
              key={band}
              className={cn(
                "pointer-events-none absolute inset-0 overflow-hidden",
                BAND_Z[band]
              )}
            >
              {GLYPHS.filter((glyph) => glyph.band === band).map((glyph) => (
                <Glyph key={glyph.text} {...glyph} progress={progress} />
              ))}
            </div>
          ) : null
        )
      )}
    </div>
  )
}

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

/**
 * Deepest site-wide field. Soft CSS orbs in the same violet / rose / teal
 * family as the ending backdrop, drifting at about 0.25x so they read as
 * far behind the glyph bands. Strength builds from the hero through
 * mid-page so the ending orbs feel like a continuation, not a sudden bloom.
 * Light mode stays a tinted wash, not a white blow-out.
 */
function Orbs({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-[-28%]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(85%_70%_at_50%_8%,rgba(109,40,217,0.08),transparent_62%)] dark:bg-[radial-gradient(85%_70%_at_50%_8%,rgba(88,28,135,0.28),transparent_62%)]" />
      <div className="absolute top-[4%] left-1/2 size-[100vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.11),transparent_64%)] dark:bg-[radial-gradient(circle,rgba(168,85,247,0.16),transparent_64%)]" />
      <div className="absolute top-[38%] left-[2%] size-[62vmin] rounded-full bg-[radial-gradient(circle,rgba(190,24,93,0.08),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(255,41,117,0.12),transparent_70%)]" />
      <div className="absolute top-[22%] right-[0%] size-[68vmin] rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.08),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(0,255,241,0.10),transparent_70%)]" />
      <div className="absolute bottom-[4%] left-[28%] size-[54vmin] rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.06),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(139,92,246,0.11),transparent_70%)]" />
    </div>
  )
}

function DriftingAurora({ progress }: { progress: MotionValue<number> }) {
  // ~0.25x of a 100vh travel: a slow rise as the page moves forward.
  const y = useTransform(progress, [0, 1], ["10vh", "-16vh"])
  const scale = useTransform(progress, [0, 1], [1.02, 1.08])
  const opacity = useTransform(progress, [0, 0.4, 0.82, 1], [0.55, 0.9, 1, 0.82])

  return (
    <motion.div
      style={{ y, scale, opacity }}
      className="absolute inset-0 will-change-transform"
    >
      <Orbs />
    </motion.div>
  )
}

function StaticAurora() {
  return (
    <div className="absolute inset-0 opacity-80">
      <Orbs />
    </div>
  )
}

export function AmbientAurora() {
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

  if (layers.background !== "aurora") return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {reduced ? <StaticAurora /> : <DriftingAurora progress={progress} />}
    </div>
  )
}

"use client"

import { useSyncExternalStore } from "react"
import { Check, ChevronDown } from "lucide-react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar"
import { cn } from "@/lib/utils"

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)))
}

function subscribeMotionValue(mv: MotionValue<number>, onStoreChange: () => void) {
  return mv.on("change", onStoreChange)
}

/**
 * Floating measuring dial — page scroll depth.
 * Tracks scroll 1:1 so the ring stops when the page stops.
 * Below 100 it asks the visitor to keep scrolling; at 100 it becomes a check.
 */
export function ScrollProgressDial() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()

  const value = useSyncExternalStore(
    (onChange) => subscribeMotionValue(scrollYProgress, onChange),
    () => clampPercent(scrollYProgress.get() * 100),
    () => 0
  )
  const visible = useSyncExternalStore(
    (onChange) => subscribeMotionValue(scrollYProgress, onChange),
    () => scrollYProgress.get() > 0.02,
    () => false
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.03, 0.97, 1],
    [0, 1, 1, 1]
  )

  const done = value >= 100
  const positionClass = cn(
    "pointer-events-none fixed z-50",
    "right-[max(1.25rem,env(safe-area-inset-right))]",
    // Sit above the slim footer once the page is complete.
    done
      ? "bottom-[max(14rem,env(safe-area-inset-bottom))] md:bottom-[max(6rem,env(safe-area-inset-bottom))]"
      : "bottom-[max(1.5rem,env(safe-area-inset-bottom))] md:bottom-[max(2rem,env(safe-area-inset-bottom))]"
  )

  if (!visible) {
    return null
  }

  const label = done ? "You're here" : "Keep scrolling"

  if (reduced) {
    return (
      <div
        className={positionClass}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <DialChrome value={value} done={done} reduced />
      </div>
    )
  }

  return (
    <motion.div
      style={{ opacity }}
      className={positionClass}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <DialChrome value={value} done={done} />
    </motion.div>
  )
}

function DialChrome({
  value,
  done,
  reduced = false,
}: {
  value: number
  done: boolean
  reduced?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn(
          "relative flex size-20 items-center justify-center rounded-full border border-black/12 bg-card/95 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_10px_28px_-6px_rgba(0,0,0,.28)] backdrop-blur-md md:size-24",
          "dark:border-white/10 dark:bg-background/80 dark:shadow-[0_10px_28px_-6px_rgba(0,0,0,.45)]"
        )}
      >
        <AnimatedCircularProgressBar
          value={value}
          min={0}
          max={100}
          gaugePrimaryColor="#a855f7"
          gaugeSecondaryColor="color-mix(in oklch, var(--muted-foreground) 35%, transparent)"
          transitionLength="0ms"
          hideValue={done}
          className="size-16 text-sm font-mono font-semibold tabular-nums text-foreground md:size-20 md:text-base"
        />
        {done ? (
          <Check
            aria-hidden
            className="absolute size-6 text-foreground md:size-7"
            strokeWidth={2.4}
          />
        ) : null}
      </div>
      <span className="text-[0.65rem] font-medium tracking-wide text-muted-foreground">
        {done ? "You're here" : "Keep scrolling"}
      </span>
      {!done && !reduced ? (
        <ChevronDown
          aria-hidden
          className="size-3.5 animate-bounce text-muted-foreground"
        />
      ) : null}
    </div>
  )
}

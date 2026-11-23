"use client"

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react"
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
} from "motion/react"

import { cn } from "@/lib/utils"

type ScrollVelocityRowProps = {
  children: ReactNode
  className?: string
  /** Idle direction. `left` moves text toward the left. */
  direction?: "left" | "right"
  /** Idle speed in px/s. @default 32 */
  baseSpeed?: number
  /** Extra px/s added at full signed boost. @default 70 */
  boostSpeed?: number
  /** |scrollY| velocity that maps to full boost. @default 2000 */
  velocityScale?: number
  /** Absolute cap on the scroll boost in px/s. @default 110 */
  maxBoost?: number
  gap?: string
}

/**
 * Magic UI–style ScrollVelocity / VelocityScroll, implemented with Motion
 * and the page's existing scroll (Lenis updates window scroll). Idle motion
 * follows `direction`; scroll speed and direction add a clamped boost so
 * a flick can briefly reverse a row. No extra pin height.
 */
export function ScrollVelocityRow({
  children,
  className,
  direction = "left",
  baseSpeed = 32,
  boostSpeed = 70,
  velocityScale = 2000,
  maxBoost = 110,
  gap = "1.75rem",
}: ScrollVelocityRowProps) {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const boostRef = useRef(0)
  const targetBoostRef = useRef(0)
  const rafRef = useRef(0)
  const lastTsRef = useRef(0)
  const runningRef = useRef(true)

  const { scrollY } = useScroll()
  const rawVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(rawVelocity, {
    stiffness: 140,
    damping: 32,
    mass: 0.7,
  })

  useMotionValueEvent(smoothVelocity, "change", (value) => {
    if (reduced) {
      targetBoostRef.current = 0
      return
    }
    const t = Math.max(-1, Math.min(1, value / velocityScale))
    targetBoostRef.current = Math.max(-maxBoost, Math.min(maxBoost, t * boostSpeed))
  })

  const tick = useCallback(
    function tickFn(ts: number) {
      const track = trackRef.current
      if (!track) {
        rafRef.current = requestAnimationFrame(tickFn)
        return
      }

      if (!lastTsRef.current) lastTsRef.current = ts
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000)
      lastTsRef.current = ts

      if (runningRef.current && !reduced) {
        boostRef.current +=
          (targetBoostRef.current - boostRef.current) * Math.min(1, dt * 4)

        const half = track.scrollWidth / 2
        if (half > 0) {
          // Default travel + signed scroll boost (downward scroll is
          // positive scrollY, which shifts text left, like the page).
          const dir = direction === "left" ? -1 : 1
          const px = dir * baseSpeed + -boostRef.current
          offsetRef.current += px * dt
          while (offsetRef.current <= -half) offsetRef.current += half
          while (offsetRef.current > 0) offsetRef.current -= half
          track.style.transform = `translate3d(${offsetRef.current}px,0,0)`
        }
      }

      rafRef.current = requestAnimationFrame(tickFn)
    },
    [baseSpeed, direction, reduced]
  )

  useEffect(() => {
    if (reduced) return
    lastTsRef.current = 0
    const onVisibility = () => {
      runningRef.current = document.visibilityState !== "hidden"
      lastTsRef.current = 0
    }
    runningRef.current = document.visibilityState !== "hidden"
    document.addEventListener("visibilitychange", onVisibility)
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [reduced, tick])

  if (reduced) return null

  return (
    <div
      aria-hidden
      className={cn(
        "flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
      style={{ ["--gap" as string]: gap } as CSSProperties}
    >
      <div
        ref={trackRef}
        className="flex w-max shrink-0 will-change-transform"
        style={{ gap: "var(--gap)" }}
      >
        <div className="flex shrink-0 items-center" style={{ gap: "var(--gap)" }}>
          {children}
        </div>
        <div
          className="flex shrink-0 items-center"
          style={{ gap: "var(--gap)" }}
          aria-hidden
        >
          {children}
        </div>
      </div>
    </div>
  )
}

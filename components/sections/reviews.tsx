"use client"

import { useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

import { SlimFooter } from "@/components/sections/contact"
import { EndingOutlineWord } from "@/components/sections/ending-outline-word"
import { ParallaxBackdrop, ReviewsPinned } from "@/components/sections/reviews-pinned"
import {
  brandHeadingClass,
  SectionHeading,
} from "@/components/sections/section-heading"
import { ScrollVelocityRow } from "@/components/ui/scroll-velocity"
import { reviews, siteConfig, type Review } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/**
 * Flip to "pinned" to restore the original 5-beat, one-at-a-time
 * testimonial sequence in reviews-pinned.tsx.
 */
export const reviewsQuotesLayout: "velocity" | "pinned" = "velocity"

const QUOTE_COUNT = 3
const TUTORING_PROOF = "100+ CIS students · Bellevue University"
/** Landing pin only — no extra tutoring scroll. */
const END_BEATS = 2

const ROW = {
  size: "font-heading text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
  sep: "mx-1 font-mono text-[0.55em] font-medium text-emerald-700/80 dark:text-emerald-300/80",
  name: "font-heading font-medium text-[0.72em] text-muted-foreground",
} as const

const ROW_STYLE = [
  {
    direction: "left" as const,
    baseSpeed: 42,
    boostSpeed: 80,
    separator: "//",
    text: "font-bold",
  },
  {
    direction: "right" as const,
    baseSpeed: 28,
    boostSpeed: 70,
    separator: "</>",
    text: "font-semibold text-transparent [-webkit-text-stroke:1.5px_rgba(15,23,42,0.82)] dark:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.82)]",
  },
  {
    direction: "left" as const,
    baseSpeed: 36,
    boostSpeed: 76,
    separator: "•",
    text: "font-semibold italic",
  },
] as const

function VelocityUnit({
  review,
  separator,
  textClass,
}: {
  review: Review
  separator: string
  textClass: string
}) {
  return (
    <span className={cn("flex items-center gap-x-6 whitespace-nowrap", ROW.size, textClass)}>
      <span>&ldquo;{review.quote}&rdquo;</span>
      <span className={ROW.sep}>{separator}</span>
      <span className={ROW.name}>{review.name}</span>
    </span>
  )
}

function TutoringVelocity({ items }: { items: Review[] }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6">
        {items.map((review, index) => (
          <p
            key={review.name}
            className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
          >
            <span className="mr-3 font-mono text-[0.7em] text-emerald-700 dark:text-emerald-300">
              {ROW_STYLE[index].separator}
            </span>
            &ldquo;{review.quote}&rdquo;{" "}
            <span className="text-[0.75em] font-medium text-muted-foreground">
              {review.name}
            </span>
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 py-4 md:gap-5 md:py-6">
      <div className="sr-only">
        {items.map((review) => (
          <p key={review.name}>
            {review.quote} {review.name}. {review.context}.
          </p>
        ))}
      </div>
      {items.map((review, index) => {
        const row = ROW_STYLE[index]
        const copies = Array.from({ length: 3 }, (_, copy) => (
          <VelocityUnit
            key={`${review.name}-${copy}`}
            review={review}
            separator={row.separator}
            textClass={row.text}
          />
        ))
        return (
          <ScrollVelocityRow
            key={review.name}
            direction={row.direction}
            baseSpeed={row.baseSpeed}
            boostSpeed={row.boostSpeed}
            gap="1.75rem"
            className="py-1 md:py-1.5"
          >
            {copies}
          </ScrollVelocityRow>
        )
      })}
    </div>
  )
}

function EndingSettle({ progress }: { progress: MotionValue<number> }) {
  const headingOpacity = useTransform(progress, [0, 0.4, 1], [0, 1, 1])
  const headingY = useTransform(progress, [0, 1], [72, 0])
  const headingScale = useTransform(progress, [0, 0.7, 1], [0.84, 1.03, 1])
  const headingBlur = useTransform(progress, [0, 0.4, 1], [8, 0, 0])
  const headingFilter = useTransform(headingBlur, (value) => `blur(${value}px)`)
  const footerY = useTransform(progress, [0, 1], ["130%", "0%"])
  const footerOpacity = useTransform(progress, [0, 0.45, 1], [0, 1, 1])

  return (
    <>
      <motion.div
        style={{
          opacity: headingOpacity,
          y: headingY,
          scale: headingScale,
          filter: headingFilter,
        }}
        className="pointer-events-none absolute inset-x-0 top-[28%] z-30 flex justify-center px-6 will-change-transform md:top-[30%]"
      >
        <h2
          className={cn(
            brandHeadingClass,
            "text-center drop-shadow-[0_18px_40px_rgba(0,0,0,.22)] dark:drop-shadow-[0_18px_48px_rgba(0,0,0,.55)]"
          )}
        >
          {siteConfig.footer.heading}
        </h2>
      </motion.div>
      <motion.div
        style={{ y: footerY, opacity: footerOpacity }}
        className="absolute inset-x-0 bottom-0 z-30 will-change-transform"
      >
        <SlimFooter />
      </motion.div>
    </>
  )
}

function EndingTrack() {
  const reduced = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  })

  if (reduced) {
    return (
      <>
        <h2
          className={cn(
            brandHeadingClass,
            "mx-auto mt-24 mb-10 px-6 text-center md:mt-32 md:mb-14"
          )}
        >
          {siteConfig.footer.heading}
        </h2>
        <SlimFooter id="contact" />
      </>
    )
  }

  return (
    <div
      ref={track}
      data-ending-track
      className="relative mt-16 md:mt-24"
      style={{ height: `${END_BEATS * 100}svh` }}
    >
      <div className="sticky top-0 isolate flex h-svh flex-col overflow-hidden">
        <ParallaxBackdrop progress={scrollYProgress} />
        <EndingOutlineWord progress={scrollYProgress} />
        <EndingSettle progress={scrollYProgress} />
      </div>
      <div
        id="contact"
        className="pointer-events-none absolute right-0 bottom-0 left-0 h-svh"
        aria-hidden
      />
    </div>
  )
}

/**
 * Tutoring heading and quotes sit in normal document flow. Quotes are
 * three big velocity rows (no pin, no extra scroll). The ending pin
 * is only the final "Let's build something" + footer settle.
 */
export function Reviews() {
  const { heading, description } = siteConfig.reviews
  const items = reviews.slice(0, QUOTE_COUNT)

  if (items.length === 0) return null
  if (reviewsQuotesLayout === "pinned") return <ReviewsPinned />

  return (
    <section id="reviews" className="scroll-mt-24">
      <SectionHeading heading={heading} description={description} />
      <p className="mt-6 px-6 text-center font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase md:mt-8 md:text-xs">
        {TUTORING_PROOF}
      </p>
      <div className="mt-10 md:mt-14">
        <TutoringVelocity items={items} />
      </div>
      <EndingTrack />
    </section>
  )
}

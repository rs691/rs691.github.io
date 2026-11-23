"use client"

import { useRef } from "react"
import { Quote } from "lucide-react"
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
 * "cards" is the default readable testimonial layout.
 * Flip to "velocity" for the scroll-velocity rows, or "pinned"
 * for the original 5-beat, one-at-a-time sequence.
 */
export const reviewsQuotesLayout: "cards" | "velocity" | "pinned" = "cards"

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

const CARD_ACCENT = [
  {
    mark: "text-emerald-700 dark:text-emerald-300",
    bar: "border-l-emerald-600/55 dark:border-l-emerald-400/55",
  },
  {
    mark: "text-cyan-700 dark:text-cyan-300",
    bar: "border-l-cyan-600/55 dark:border-l-cyan-400/55",
  },
  {
    mark: "text-amber-700 dark:text-amber-600",
    bar: "border-l-amber-600/55 dark:border-l-amber-400/50",
  },
] as const

const CARD_OFFSET = [
  "md:self-start",
  "md:self-end",
  "md:self-start md:ml-[8%]",
] as const

/** Small vertical travel, different per card, so the quotes stay readable. */
const CARD_PARALLAX = [
  [22, -14],
  [12, -24],
  [20, -12],
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

function TestimonialCard({
  review,
  index,
}: {
  review: Review
  index: number
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const travel = CARD_PARALLAX[index] ?? CARD_PARALLAX[0]
  const y = useTransform(scrollYProgress, [0, 1], [...travel])
  const accent = CARD_ACCENT[index] ?? CARD_ACCENT[0]
  const offset = CARD_OFFSET[index] ?? CARD_OFFSET[0]

  const articleClass = cn(
    "w-full max-w-2xl rounded-2xl border border-l-[3px] border-black/10 bg-card p-5 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_10px_28px_-10px_rgba(0,0,0,.14),0_24px_48px_-20px_rgba(0,0,0,.1)] sm:p-6 md:p-7",
    "dark:border-white/10 dark:shadow-none",
    accent.bar
  )

  const body = (
    <>
      <Quote
        aria-hidden
        className={cn("mb-3 size-5 shrink-0 sm:size-6", accent.mark)}
      />
      <blockquote className="font-heading text-base leading-relaxed tracking-tight text-pretty sm:text-lg sm:leading-relaxed md:text-xl md:leading-relaxed">
        &ldquo;{review.quote}&rdquo;
      </blockquote>
      <footer className="mt-4 flex flex-col gap-0.5 border-t border-black/8 pt-3 dark:border-white/10">
        <cite className="font-heading text-sm font-medium not-italic">
          {review.name}
        </cite>
        {review.context ? (
          <p className="text-xs text-muted-foreground sm:text-sm">
            {review.context}
          </p>
        ) : null}
      </footer>
    </>
  )

  if (reduced) {
    return (
      <article ref={ref} className={cn(articleClass, offset)}>
        {body}
      </article>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.07,
      }}
      className={cn("w-full max-w-2xl", offset)}
    >
      <motion.article ref={ref} style={{ y }} className={articleClass}>
        {body}
      </motion.article>
    </motion.div>
  )
}

function TutoringCards({ items }: { items: Review[] }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 md:gap-7">
      {items.map((review, index) => (
        <TestimonialCard key={review.name} review={review} index={index} />
      ))}
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
 * Tutoring heading and quotes sit in normal document flow. The default
 * layout is staggered testimonial cards (no pin, no extra scroll). The
 * ending pin is only the final "Let's build something" + footer settle.
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
      <div className="mt-8 md:mt-10">
        {reviewsQuotesLayout === "velocity" ? (
          <TutoringVelocity items={items} />
        ) : (
          <TutoringCards items={items} />
        )}
      </div>
      <EndingTrack />
    </section>
  )
}

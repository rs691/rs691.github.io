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
import { EndingForegroundGlyphs } from "@/components/sections/ending-foreground-glyphs"
import { EndingOutlineWord } from "@/components/sections/ending-outline-word"
import {
  brandHeadingClass,
  SectionHeading,
  sectionBodyClass,
} from "@/components/sections/section-heading"
import { reviews, siteConfig, type Review } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/** Intro + 3 testimonials + landing. Track height is BEATS * 100svh so
 *  progress 1 is exactly the moment the heading and slim footer settle. */
const BEATS = 5
const QUOTE_COUNT = 3
const TUTORING_PROOF = "100+ CIS students · Bellevue University"

function quoteBand(index: number) {
  const start = 0.2 + index * (0.6 / QUOTE_COUNT)
  const end = start + 0.6 / QUOTE_COUNT
  return {
    start,
    enter: start + 0.04,
    holdEnd: end - 0.05,
    end,
  }
}

function ParallaxBackdrop({ progress }: { progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 1], ["12%", "-12%"])
  const scale = useTransform(progress, [0, 1], [1.06, 1.16])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        style={{ y, scale }}
        className="absolute inset-[-18%]"
      >
        <div className="absolute top-[8%] left-1/2 size-[90vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.22),transparent_64%)]" />
        <div className="absolute top-[30%] left-[8%] size-[55vmin] rounded-full bg-[radial-gradient(circle,rgba(255,41,117,0.16),transparent_70%)]" />
        <div className="absolute right-[6%] bottom-[12%] size-[60vmin] rounded-full bg-[radial-gradient(circle,rgba(0,255,241,0.12),transparent_70%)]" />
      </motion.div>
    </div>
  )
}

function TestimonialCard({
  review,
  index,
  progress,
}: {
  review: Review
  index: number
  progress: MotionValue<number>
}) {
  const { start, enter, holdEnd, end } = quoteBand(index)
  // Drive type from raw scroll progress — no spring lag while reading.
  const opacity = useTransform(
    progress,
    [start, enter, holdEnd, end],
    [0, 1, 1, 0]
  )
  const y = useTransform(
    progress,
    [start, enter, holdEnd, end],
    [36, 0, 0, -36]
  )
  const blur = useTransform(
    progress,
    [start, enter, holdEnd, end],
    [10, 0, 0, 10]
  )
  const filter = useTransform(blur, (value) => `blur(${value}px)`)
  const rotateX = useTransform(
    progress,
    [start, enter, holdEnd, end],
    [9, 0, 0, -8]
  )
  const rotateY = useTransform(
    progress,
    [start, enter, holdEnd, end],
    [-4, 0, 0, 4]
  )

  return (
    <motion.figure
      style={{
        opacity,
        y,
        filter,
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center px-4 will-change-transform"
    >
      <div
        className={cn(
          "flex w-full max-w-3xl flex-col items-center gap-5 rounded-2xl border border-black/12 bg-card/90 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,1),0_10px_28px_-10px_rgba(0,0,0,.14),0_24px_48px_-20px_rgba(0,0,0,.12)] backdrop-blur-md xs:p-8 md:gap-6 md:p-10",
          "dark:border-white/10 dark:bg-background/80 dark:shadow-[0_16px_48px_-16px_rgba(0,0,0,.55)]"
        )}
      >
        <blockquote className="font-heading text-xl font-semibold tracking-tight text-balance xs:text-2xl md:text-4xl md:leading-snug">
          &ldquo;{review.quote}&rdquo;
        </blockquote>
        <figcaption className="flex flex-col gap-1">
          <span className="font-mono text-[0.65rem] tracking-widest text-muted-foreground uppercase md:text-xs">
            {review.name}
          </span>
          <span className="text-xs text-muted-foreground md:text-sm">
            {review.context}
          </span>
        </figcaption>
      </div>
    </motion.figure>
  )
}

function BeatDots({ progress }: { progress: MotionValue<number> }) {
  const rowOpacity = useTransform(
    progress,
    [0.18, 0.24, 0.76, 0.82],
    [0, 1, 1, 0]
  )

  return (
    <motion.div
      style={{ opacity: rowOpacity }}
      className="pointer-events-none absolute inset-x-0 bottom-28 z-20 flex justify-center gap-2 md:bottom-32"
      aria-hidden
    >
      {reviews.slice(0, QUOTE_COUNT).map((review, index) => (
        <BeatDot key={review.name} progress={progress} index={index} />
      ))}
    </motion.div>
  )
}

function BeatDot({
  progress,
  index,
}: {
  progress: MotionValue<number>
  index: number
}) {
  const { start, enter, holdEnd, end } = quoteBand(index)
  const opacity = useTransform(
    progress,
    [start, enter, holdEnd, end],
    [0.3, 1, 1, 0.3]
  )
  const scale = useTransform(
    progress,
    [start, enter, holdEnd, end],
    [0.85, 1.25, 1.25, 0.85]
  )

  return (
    <motion.span
      style={{ opacity, scale }}
      className="size-1.5 rounded-full bg-foreground md:size-2"
    />
  )
}

function TutoringIntro({ progress }: { progress: MotionValue<number> }) {
  const { heading, description } = siteConfig.reviews
  const opacity = useTransform(progress, [0, 0.12, 0.2], [1, 1, 0])
  const y = useTransform(progress, [0, 0.2], [0, -24])
  const blur = useTransform(progress, [0.12, 0.2], [0, 8])
  const filter = useTransform(blur, (value) => `blur(${value}px)`)

  return (
    <motion.div
      style={{ opacity, y, filter }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center will-change-transform"
    >
      <SectionHeading heading={heading} description={description} />
      <p className="mt-8 font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase md:mt-10 md:text-xs">
        {TUTORING_PROOF}
      </p>
    </motion.div>
  )
}

function EndingLanding({ progress }: { progress: MotionValue<number> }) {
  // Foreground travels a little farther than mid-layer (≈1.2x) so it
  // feels closer as it settles, with a soft shadow at rest.
  const headingOpacity = useTransform(progress, [0.8, 0.9, 1], [0, 1, 1])
  const headingY = useTransform(progress, [0.8, 1], [72, 0])
  const headingScale = useTransform(progress, [0.8, 0.94, 1], [0.84, 1.03, 1])
  const headingBlur = useTransform(progress, [0.8, 0.9, 1], [8, 0, 0])
  const headingFilter = useTransform(headingBlur, (value) => `blur(${value}px)`)

  const footerY = useTransform(progress, [0.8, 1], ["130%", "0%"])
  const footerOpacity = useTransform(progress, [0.8, 0.9, 1], [0, 1, 1])

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

function StaticQuotes({ items }: { items: Review[] }) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-3xl flex-col gap-8 px-6",
        sectionBodyClass
      )}
    >
      {items.map((review) => (
        <figure
          key={review.name}
          className={cn(
            "flex flex-col items-center gap-4 rounded-2xl border border-black/12 bg-card/90 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,1),0_10px_28px_-10px_rgba(0,0,0,.14)] xs:p-8",
            "dark:border-white/10 dark:bg-background/80 dark:shadow-none"
          )}
        >
          <blockquote className="font-heading text-xl font-semibold tracking-tight text-balance md:text-2xl md:leading-snug">
            &ldquo;{review.quote}&rdquo;
          </blockquote>
          <figcaption className="flex flex-col gap-1">
            <span className="font-medium">{review.name}</span>
            <span className="text-sm text-muted-foreground">
              {review.context}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/**
 * Ending sequence:
 *  1. Tutoring intro holds.
 *  2–4. One testimonial at a time (glass card, fade/blur/tilt).
 *  5. "Let's build something" scales in; slim footer rises and rests.
 * Track height is five viewports so progress 1 == the last screen.
 */
export function Reviews() {
  const { heading, description } = siteConfig.reviews
  const items = reviews.slice(0, QUOTE_COUNT)
  const reduced = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  })

  if (items.length === 0) return null

  if (reduced) {
    return (
      <section id="reviews" className="scroll-mt-24">
        <SectionHeading heading={heading} description={description} />
        <p className="mt-6 px-6 text-center font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase md:text-xs">
          {TUTORING_PROOF}
        </p>
        <StaticQuotes items={items} />
        <h2
          className={cn(
            brandHeadingClass,
            "mx-auto mt-24 mb-10 px-6 text-center md:mt-32 md:mb-14"
          )}
        >
          {siteConfig.footer.heading}
        </h2>
        <SlimFooter id="contact" />
      </section>
    )
  }

  return (
    <section id="reviews" className="scroll-mt-24">
      <div
        ref={track}
        data-ending-track
        className="relative"
        style={{ height: `${BEATS * 100}svh` }}
      >
        <div className="sticky top-0 isolate flex h-svh flex-col overflow-hidden bg-background">
          <ParallaxBackdrop progress={scrollYProgress} />
          <EndingOutlineWord progress={scrollYProgress} />
          <EndingForegroundGlyphs progress={scrollYProgress} />
          <TutoringIntro progress={scrollYProgress} />
          <div className="relative min-h-0 flex-1">
            {items.map((review, index) => (
              <TestimonialCard
                key={review.name}
                review={review}
                index={index}
                progress={scrollYProgress}
              />
            ))}
          </div>
          <BeatDots progress={scrollYProgress} />
          <EndingLanding progress={scrollYProgress} />
        </div>
        {/* Last viewport of the track — hash, Lenis snap, and Get in touch
            all land here, with the heading and footer already at rest. */}
        <div
          id="contact"
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-svh"
          aria-hidden
        />
      </div>
    </section>
  )
}


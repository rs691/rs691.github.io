import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SectionHeading } from "@/components/sections/section-heading"
import { TechLogo } from "@/components/sections/tech-logo"
import { BlurFade } from "@/components/ui/blur-fade"
import { buttonVariants } from "@/components/ui/button"
import { Marquee } from "@/components/ui/marquee"
import { StaggerItem, StaggerReveal } from "@/components/ui/stagger-reveal"
import { cn } from "@/lib/utils"
import { marqueeRows, siteConfig, type MarqueeIcon } from "@/lib/site-config"

const blurLayers = [
  { blur: "backdrop-blur-[1px]", stops: "transparent 0%, black 25%, black 50%, transparent 75%" },
  { blur: "backdrop-blur-[2px]", stops: "transparent 25%, black 50%, black 75%, transparent 100%" },
  { blur: "backdrop-blur-[5px]", stops: "transparent 50%, black 75%, black 100%" },
  { blur: "backdrop-blur-[10px]", stops: "transparent 75%, black 100%" },
]

/** Flat band: same soft fade on both left and right edges */
const trackMask = {
  maskImage:
    "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0.3) 92%, rgba(0,0,0,0) 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0.3) 92%, rgba(0,0,0,0) 100%)",
} as const

const edgeBlurMask = (side: "left" | "right") => {
  const axis =
    side === "left"
      ? "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0) 100%)"
      : "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0) 100%)"

  return {
    maskImage: axis,
    WebkitMaskImage: axis,
  } as const
}

function IconTile({
  icon: Icon,
  label,
  className,
  variant,
  wordmark,
}: MarqueeIcon) {
  return (
    <div
      title={label}
      className={cn(
        "tile-depth relative flex size-(--tile) shrink-0 items-center justify-center rounded-2xl border border-black/12 bg-card transition-transform duration-300 hover:-translate-y-1.5 dark:border-transparent dark:bg-card/80",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl bg-current opacity-[0.12] dark:opacity-[0.14]"
      />
      <TechLogo icon={Icon} variant={variant} wordmark={wordmark} />
      <span className="sr-only">{label}</span>
    </div>
  )
}

function ProgressiveBlur({
  side,
  className,
}: {
  side: "top" | "bottom"
  className?: string
}) {
  const direction = side === "bottom" ? "to bottom" : "to top"

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0",
        side === "bottom" ? "bottom-0" : "top-0",
        className
      )}
    >
      {blurLayers.map(({ blur, stops }) => (
        <div
          key={blur}
          className={cn("absolute inset-0", blur)}
          style={{
            maskImage: `linear-gradient(${direction}, ${stops})`,
            WebkitMaskImage: `linear-gradient(${direction}, ${stops})`,
          }}
        />
      ))}
      <div
        className={cn(
          "absolute inset-0 from-transparent via-background/20 via-55% to-background/70 dark:via-background/12 dark:to-background/65",
          side === "bottom" ? "bg-linear-to-b" : "bg-linear-to-t"
        )}
      />
    </div>
  )
}

function EdgeBlurWalls() {
  const wall =
    "pointer-events-none absolute inset-y-0 z-10 w-[clamp(22%,calc(14%+5vw),30%)] backdrop-blur-2xl md:backdrop-blur-3xl"

  return (
    <>
      <div
        aria-hidden
        className={cn(
          wall,
          "left-0 bg-linear-to-r from-background via-background/80 to-transparent via-45%"
        )}
        style={edgeBlurMask("left")}
      />
      <div
        aria-hidden
        className={cn(
          wall,
          "right-0 bg-linear-to-l from-background via-background/80 to-transparent via-45%"
        )}
        style={edgeBlurMask("right")}
      />
    </>
  )
}

function MarqueeTrack({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="w-full" style={trackMask}>
        <MarqueeRows />
      </div>
      <EdgeBlurWalls />
    </div>
  )
}

function MarqueeRows({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col", className)}>
      {marqueeRows.map((row, i) => (
        <Marquee
          key={i}
          reverse={row.reverse}
          repeat={6}
          className="py-[calc(var(--gap)/2)] [--gap:0.65rem] md:[--gap:0.85rem]"
          style={{ "--duration": row.duration } as React.CSSProperties}
        >
          {row.icons.map((item) => (
            <IconTile key={item.label} {...item} />
          ))}
        </Marquee>
      ))}
    </div>
  )
}

function BottomText({ className }: { className?: string }) {
  const { heading, description } = siteConfig.marquee
  const { primary, secondary } = siteConfig.ctas

  return (
    <div className={cn("z-10 flex flex-col items-center", className)}>
      <SectionHeading heading={heading} description={description} />
      <StaggerReveal
        inView
        className="mt-14 flex justify-center md:mt-16"
      >
        <StaggerItem className="flex flex-col items-center gap-4 px-6 xs:flex-row xs:gap-5 md:gap-6">
          <Link
            href={primary.href}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            {primary.label}
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Link>
          <Link
            href={secondary.href}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            {secondary.label}
          </Link>
        </StaggerItem>
      </StaggerReveal>
    </div>
  )
}

function MarqueeWithEntrance({ className }: { className?: string }) {
  return (
    <BlurFade duration={0.7} delay={0} blur="8px" offset={12} direction="up">
      <div className={cn("relative w-full", className)}>
        <MarqueeTrack />
        <ProgressiveBlur side="top" className="h-[48%]" />
        <ProgressiveBlur side="bottom" className="h-[48%]" />
      </div>
    </BlurFade>
  )
}

export function IconMarquee({ top }: { top?: React.ReactNode }) {
  if (top) {
    return (
      <section
        id="stack"
        className="flex flex-1 flex-col justify-center overflow-hidden pt-16 [--overlap:4.5rem] [--tile:clamp(3.5rem,min(10svh,20vw),10rem)] md:pt-24 md:[--overlap:clamp(3rem,9svh,8rem)]"
      >
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          {top}
        </div>
        <div className="relative -my-(--overlap) w-full">
          <MarqueeWithEntrance />
        </div>
        <BottomText className="relative" />
      </section>
    )
  }

  return (
    <section
      id="stack"
      className="relative w-full scroll-mt-20 py-6 [--tile:clamp(4rem,9svh,6rem)]"
    >
      <div className="relative mx-auto max-w-6xl overflow-hidden">
        <BlurFade duration={0.7} delay={0} blur="8px" offset={12} direction="up">
          <div className="relative pb-24 md:pb-28">
            <MarqueeTrack />
            <ProgressiveBlur side="bottom" className="h-3/4" />
          </div>
        </BlurFade>
        <BottomText className="absolute inset-x-0 bottom-0 pb-8" />
      </div>
    </section>
  )
}

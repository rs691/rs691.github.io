"use client"

import { AuroraText } from "@/components/ui/aurora-text"
import { StaggerItem, StaggerReveal } from "@/components/ui/stagger-reveal"
import { auroraColors } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/**
 * Single brand heading scale — hero name and every section title share this.
 * Keep in sync with HeroText h1.
 */
export const brandHeadingClass =
  "max-w-4xl font-heading text-5xl font-semibold tracking-tight text-balance leading-[1.08] xs:text-6xl md:text-[clamp(3.75rem,9.5vw,6rem)] md:leading-[1.05]"

/** Supporting line under a brand heading (spacing owned by parent gap / local mt) */
export const brandDescriptionClass =
  "max-w-xl text-base text-balance leading-relaxed text-muted-foreground xs:text-lg md:max-w-2xl"

/** Space from heading block → section body (projects grid, timeline, etc.) */
export const sectionBodyClass = "mt-14 md:mt-16"

export function SectionHeading({
  heading,
  description,
  className,
  as = "h2",
}: {
  heading: string
  description?: string
  className?: string
  as?: "h1" | "h2"
}) {
  return (
    <StaggerReveal
      inView={as === "h2"}
      className={cn(
        "flex flex-col items-center gap-5 px-6 text-center md:gap-6",
        className
      )}
    >
      <StaggerItem as={as} className={brandHeadingClass}>
        <AuroraText colors={auroraColors}>{heading}</AuroraText>
      </StaggerItem>
      {description ? (
        <StaggerItem as="p" className={brandDescriptionClass}>
          {description}
        </StaggerItem>
      ) : null}
    </StaggerReveal>
  )
}

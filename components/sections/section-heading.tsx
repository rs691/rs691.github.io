"use client"

import { useReducedMotion } from "motion/react"

import { AuroraText } from "@/components/ui/aurora-text"
import { StaggerItem, StaggerReveal } from "@/components/ui/stagger-reveal"
import { auroraColors } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/**
 * Single brand heading scale — hero name and every section title share this.
 * Keep in sync with HeroText h1.
 */
export const brandHeadingClass =
  "max-w-4xl font-heading text-5xl font-semibold tracking-tight text-balance xs:text-6xl md:text-[clamp(3.75rem,9.5vw,6rem)] md:leading-[0.95]"

/** Supporting line under a brand heading */
export const brandDescriptionClass =
  "mt-5 max-w-xl text-base text-balance text-muted-foreground xs:text-lg md:mt-6 md:max-w-2xl"

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
  const reduced = useReducedMotion()

  return (
    <StaggerReveal
      inView={as === "h2"}
      className={cn(
        "flex flex-col items-center px-6 text-center",
        className
      )}
    >
      <StaggerItem as={as} className={brandHeadingClass}>
        {reduced ? (
          heading
        ) : (
          <AuroraText colors={auroraColors}>{heading}</AuroraText>
        )}
      </StaggerItem>
      {description ? (
        <StaggerItem as="p" className={brandDescriptionClass}>
          {description}
        </StaggerItem>
      ) : null}
    </StaggerReveal>
  )
}

"use client"

import { Mail } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

/**
 * Traditional slim footer bar — email, links, and copyright.
 * Used at the rest position of the ending sequence and in the
 * reduced-motion document-flow layout.
 */
export function SlimFooter({
  className,
  id,
}: {
  className?: string
  id?: string
}) {
  const { email, links } = siteConfig.footer

  return (
    <footer
      id={id}
      className={cn(
        "relative border-t border-black/10 bg-card/90 shadow-[0_-12px_40px_-16px_rgba(0,0,0,.28)] backdrop-blur-md",
        "dark:border-white/10 dark:bg-background/85 dark:shadow-[0_-16px_48px_-16px_rgba(0,0,0,.55)]",
        // Leave a clear lane for the fixed scroll dial in the lower-right.
        "px-6 py-4 pr-24 md:px-8 md:pr-28",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 text-center sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:text-left">
        <a
          href={`mailto:${email}`}
          className={cn(buttonVariants({ size: "sm" }), "gap-2")}
        >
          <Mail data-icon="inline-start" aria-hidden />
          {email}
        </a>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground"
        >
          <a
            href={siteConfig.footer.secondaryCta.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center px-1 transition-colors hover:text-foreground"
          >
            {siteConfig.footer.secondaryCta.label}
          </a>
          {links
            .filter((link) => link.label !== "Portfolio")
            .map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center px-1 transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
        </nav>
        <p className="text-xs text-muted-foreground">
          &copy; 2026 {siteConfig.name}
        </p>
      </div>
    </footer>
  )
}

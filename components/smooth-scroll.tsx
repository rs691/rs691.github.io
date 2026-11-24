"use client"

import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"
import Snap from "lenis/snap"
import { cancelFrame, frame } from "motion"
import { useReducedMotion } from "motion/react"

const SNAP_TARGETS = [
  { selector: "#top", align: "start" as const },
  { selector: "#projects", align: "start" as const },
  { selector: "#experience", align: "start" as const },
  /** Last viewport of the ending pin — footer + heading at rest. */
  { selector: "#contact", align: "start" as const },
] as const

/**
 * No sticky top header — the theme toggle and progress dial sit in the
 * corners — so target alignment is flush to the section start. Bump this
 * if a top bar is added later.
 */
const HEADER_OFFSET = 0

/** easeOutExpo; same family as Lenis's default, exact at t = 1. */
function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

/** Shared options for programmatic / anchor scrolls. */
const SCROLL_TO = {
  offset: HEADER_OFFSET,
  duration: 1.15,
  easing: easeOutExpo,
} as const

let lenisRef: Lenis | null = null

/** Live Lenis instance, if smooth scroll is active. */
export function getLenis(): Lenis | null {
  return lenisRef
}

declare global {
  interface Window {
    getLenis?: typeof getLenis
  }
}

if (typeof window !== "undefined") {
  window.getLenis = getLenis
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function resolveTarget(target: string | Element): HTMLElement | null {
  if (typeof target !== "string") {
    return target instanceof HTMLElement ? target : null
  }
  const el = document.querySelector(target)
  return el instanceof HTMLElement ? el : null
}

/**
 * Scroll to a same-page hash or element through Lenis when it is running,
 * otherwise through native scroll. Used by the dock, skip link, and CTAs.
 */
export function scrollToTarget(target: string | Element) {
  const el = resolveTarget(target)
  if (!el) return

  const reduced = prefersReducedMotion()
  if (reduced || !lenisRef) {
    el.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    })
    return
  }

  lenisRef.scrollTo(el, SCROLL_TO)
}

/**
 * Scroll to the settled ending (heading + slim footer).
 * `#contact` is the last viewport of the reviews track, so block-start
 * aligns the pin at progress 1. Hash links and "Get in touch" share this.
 */
export function scrollToContact() {
  scrollToTarget("#contact")
}

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

function samePageHash(anchor: Element): string | null {
  if (!(anchor instanceof HTMLAnchorElement)) return null
  const href = anchor.getAttribute("href")
  if (!href || !href.startsWith("#") || href === "#") return null
  if (anchor.target && anchor.target !== "_self") return null
  try {
    const url = new URL(anchor.href, window.location.href)
    if (url.pathname !== window.location.pathname) return null
    if (url.search !== window.location.search) return null
    return url.hash || href
  } catch {
    return href
  }
}

/**
 * Root Lenis smooth scroll + proximity snaps at major section edges.
 * Imperative mount keeps the React tree identical on server and client
 * (avoids hydration mismatches from swapping in ReactLenis after mount).
 *
 * The ending pin is not snapped at its start — only `#contact` (the rest
 * state) is a snap target, so mid-sequence quotes are not yanked away.
 *
 * The rAF loop is driven from Motion's `frame.update` so Lenis and
 * useScroll / useTransform share a single frame (no double-rAF jank).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
      // Hash links are handled below so Next.js <Link>, the skip link,
      // and #contact all share one path with the header offset.
      anchors: false,
      respectReducedMotion: true,
    })
    lenisRef = lenis

    const onFrame = ({ timestamp }: { timestamp: number }) => {
      lenis.raf(timestamp)
    }
    frame.update(onFrame, true)

    const snap = new Snap(lenis, {
      type: "proximity",
      distanceThreshold: "20%",
      debounce: 160,
      lerp: 0.08,
    })

    const unsubs: Array<() => void> = []
    for (const { selector, align } of SNAP_TARGETS) {
      const el = document.querySelector(selector)
      if (!(el instanceof HTMLElement)) continue
      unsubs.push(snap.addElement(el, { align, ignoreSticky: true }))
    }

    const onResize = () => snap.resize()
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (isModifiedClick(event)) return
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest("a[href^='#']")
      if (!anchor) return
      const hash = samePageHash(anchor)
      if (!hash) return
      const el = resolveTarget(hash)
      if (!el) return
      event.preventDefault()
      scrollToTarget(el)
      if (window.location.hash !== hash) {
        history.pushState(null, "", hash)
      }
      if (anchor.classList.contains("skip-link")) {
        el.focus({ preventScroll: true })
      }
    }
    const onHash = () => {
      if (window.location.hash) scrollToTarget(window.location.hash)
    }

    window.addEventListener("resize", onResize)
    document.addEventListener("click", onClick, true)
    window.addEventListener("hashchange", onHash)
    if (window.location.hash) {
      requestAnimationFrame(() => scrollToTarget(window.location.hash))
    }

    return () => {
      window.removeEventListener("resize", onResize)
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("hashchange", onHash)
      cancelFrame(onFrame)
      for (const unsub of unsubs) unsub()
      snap.destroy()
      lenis.destroy()
      if (lenisRef === lenis) lenisRef = null
    }
  }, [reduced])

  return children
}
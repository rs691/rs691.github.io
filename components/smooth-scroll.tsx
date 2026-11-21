"use client"

import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"
import Snap from "lenis/snap"
import { useReducedMotion } from "motion/react"

const SNAP_TARGETS = [
  { selector: "#top", align: "start" as const },
  { selector: "#projects", align: "start" as const },
  { selector: "#experience", align: "start" as const },
  /** Last viewport of the ending pin — footer + heading at rest. */
  { selector: "#contact", align: "start" as const },
] as const

let lenisRef: Lenis | null = null

/**
 * Scroll to the settled ending (heading + slim footer).
 * `#contact` is the last viewport of the reviews track, so block-start
 * aligns the pin at progress 1. Hash links and "Get in touch" share this.
 */
export function scrollToContact() {
  const el = document.getElementById("contact")
  if (!el) return

  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches

  if (reduced || !lenisRef) {
    el.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    })
    return
  }

  lenisRef.scrollTo(el)
}

function isContactLink(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return false
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false
  }
  const target = event.target
  if (!(target instanceof Element)) return false
  const anchor = target.closest("a[href='#contact']")
  return Boolean(anchor)
}

/**
 * Root Lenis smooth scroll + proximity snaps at major section edges.
 * Imperative mount keeps the React tree identical on server and client
 * (avoids hydration mismatches from swapping in ReactLenis after mount).
 *
 * The ending pin is not snapped at its start — only `#contact` (the rest
 * state) is a snap target, so mid-sequence quotes are not yanked away.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: true,
      syncTouch: false,
    })
    lenisRef = lenis

    const snap = new Snap(lenis, {
      type: "proximity",
      distanceThreshold: "20%",
      debounce: 160,
      lerp: 0.1,
    })

    const unsubs: Array<() => void> = []
    for (const { selector, align } of SNAP_TARGETS) {
      const el = document.querySelector(selector)
      if (!(el instanceof HTMLElement)) continue
      unsubs.push(snap.addElement(el, { align, ignoreSticky: true }))
    }

    const onResize = () => snap.resize()
    const onClick = (event: MouseEvent) => {
      if (!isContactLink(event)) return
      event.preventDefault()
      scrollToContact()
      if (window.location.hash !== "#contact") {
        history.pushState(null, "", "#contact")
      }
    }
    const onHash = () => {
      if (window.location.hash === "#contact") scrollToContact()
    }

    window.addEventListener("resize", onResize)
    document.addEventListener("click", onClick, true)
    window.addEventListener("hashchange", onHash)
    if (window.location.hash === "#contact") {
      requestAnimationFrame(() => scrollToContact())
    }

    return () => {
      window.removeEventListener("resize", onResize)
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("hashchange", onHash)
      for (const unsub of unsubs) unsub()
      snap.destroy()
      lenis.destroy()
      if (lenisRef === lenis) lenisRef = null
    }
  }, [reduced])

  return children
}

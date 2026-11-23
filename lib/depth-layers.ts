/**
 * Fixed depth map (far → near). The live Layers comparison panel and
 * localStorage overrides have been removed, so every visitor gets this
 * mix: circuit-grid background, three glyph bands with z-order depth,
 * and the tutoring quote-cards layout (`reviewsQuotesLayout` in
 * reviews.tsx). Alternate components (aurora, outline words, velocity
 * rows, pinned quotes) stay in the repo but remain off.
 *
 * Layer              | z    | speed         | direction            | blur
 * -------------------|------|---------------|----------------------|--------
 * Background         | 0    | ~0.22–0.28x   | slow rise / drift    | soft CSS
 * Ambient words      | 0    | ~0.25–0.35x   | left (slow cruise)   | 2–3px  (off)
 * Ending outline     | 1    | 0.40–0.55x    | right                | 0–1px  (off)
 * Far glyphs         | 1    | ~0.45–0.58x   | up + left            | soft
 * Mid glyphs         | 2    | ~0.95–1.10x   | up + right / side    | slight
 * Near glyphs        | 3    | ~1.55–1.85x   | fall / opposite      | 0
 * Heading / footer   | 30   | ~1.2x         | rise, then settle    | 0
 */

export const BACKGROUND_CHOICES = ["none", "aurora", "circuit"] as const

export type BackgroundChoice = (typeof BACKGROUND_CHOICES)[number]

export const DEPTH_LAYER_KEYS = [
  "ambientOutline",
  "outlineWord",
  "farGlyphs",
  "midGlyphs",
  "nearGlyphs",
  "imageLayer",
  "quoteMarks",
  "marquee",
] as const

export type DepthLayerKey = (typeof DEPTH_LAYER_KEYS)[number]

export type DepthLayerToggles = Record<DepthLayerKey, boolean> & {
  background: BackgroundChoice
}

export const depthLayerDefaults: DepthLayerToggles = {
  background: "circuit",
  ambientOutline: false,
  outlineWord: false,
  farGlyphs: true,
  midGlyphs: true,
  nearGlyphs: true,
  imageLayer: false,
  quoteMarks: false,
  marquee: false,
}

/** @deprecated Use depthLayerDefaults. Kept as a static fallback. */
export const endingLayerToggles = depthLayerDefaults

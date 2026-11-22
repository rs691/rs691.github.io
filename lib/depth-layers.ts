/**
 * Depth map (far → near). Each layer has its own speed and direction
 * so stacked layers read as real parallax. Toggle them independently
 * or apply a preset to compare combinations. Stubs are no-ops until built.
 *
 * Layer              | z    | speed         | direction           | blur      | opacity
 * -------------------|------|---------------|---------------------|-----------|----------
 * Ambient words      | 0    | ~0.25–0.35x   | left (slow cruise)  | 2–3px     | 0.06–0.10
 * Ending outline     | 1    | 0.40–0.55x    | right               | 0–1px     | 0.08–0.12
 * Back glyphs        | 5    | 0.70–0.95x    | rise (up)           | 1.5–2.5px | 0.16–0.22
 * Front glyphs       | 20   | 1.45–1.85x    | fall / right        | 0         | 0.28–0.38
 * Heading / footer   | 30   | ~1.2x         | rise, then settle   | 0         | 1
 * Image layer        | —    | stub          | —                   | —         | off
 * Quote marks        | —    | stub          | —                   | —         | off
 * Marquee            | —    | stub          | —                   | —         | off
 *
 * Safe zone: ambient words and glyphs stay in the outer ~25% gutters
 * and the top corners, leaving the center reading column mostly clear.
 *
 * Presets: minimal (front glyphs), words (ambient only), glyphs+words,
 * all (every switch, including no-op stubs).
 */

export const DEPTH_LAYER_KEYS = [
  "ambientOutline",
  "outlineWord",
  "backGlyphs",
  "frontGlyphs",
  "imageLayer",
  "quoteMarks",
  "marquee",
] as const

export type DepthLayerKey = (typeof DEPTH_LAYER_KEYS)[number]

export type DepthLayerToggles = Record<DepthLayerKey, boolean>

export const DEPTH_LAYER_LABELS: Record<DepthLayerKey, string> = {
  ambientOutline: "Ambient words",
  outlineWord: "Ending outline",
  backGlyphs: "Back glyphs",
  frontGlyphs: "Front glyphs",
  imageLayer: "Image layer (stub)",
  quoteMarks: "Quote marks (stub)",
  marquee: "Marquee (stub)",
}

export const DEPTH_LAYER_STUBS: readonly DepthLayerKey[] = [
  "imageLayer",
  "quoteMarks",
  "marquee",
]

const off: DepthLayerToggles = {
  ambientOutline: false,
  outlineWord: false,
  backGlyphs: false,
  frontGlyphs: false,
  imageLayer: false,
  quoteMarks: false,
  marquee: false,
}

export const depthLayerDefaults: DepthLayerToggles = {
  ...off,
  ambientOutline: true,
  outlineWord: true,
  backGlyphs: true,
  frontGlyphs: true,
}

export const depthLayerPresets = {
  minimal: { ...off, frontGlyphs: true },
  words: { ...off, ambientOutline: true },
  "glyphs+words": { ...depthLayerDefaults },
  all: {
    ...depthLayerDefaults,
    imageLayer: true,
    quoteMarks: true,
    marquee: true,
  },
} as const satisfies Record<string, DepthLayerToggles>

export type DepthLayerPreset = keyof typeof depthLayerPresets

export const DEPTH_LAYER_PRESET_LABELS: Record<DepthLayerPreset, string> = {
  minimal: "minimal",
  words: "words",
  "glyphs+words": "glyphs+words",
  all: "all",
}

export const DEPTH_LAYERS_STORAGE_KEY = "rs-depth-layers"

export function isLiveEditorEnabled() {
  if (typeof window === "undefined") return false
  return (
    process.env.NODE_ENV === "development" ||
    new URLSearchParams(window.location.search).has("layers")
  )
}

export function parseDepthLayers(raw: string | null): DepthLayerToggles {
  const next = { ...depthLayerDefaults }
  if (!raw) return next
  try {
    const parsed = JSON.parse(raw) as Partial<DepthLayerToggles>
    for (const key of DEPTH_LAYER_KEYS) {
      if (typeof parsed[key] === "boolean") next[key] = parsed[key]
    }
  } catch {
    return { ...depthLayerDefaults }
  }
  return next
}

let snapshot: DepthLayerToggles = depthLayerDefaults
let snapshotKey: string | null = null

export function readDepthLayers(): DepthLayerToggles {
  if (typeof window === "undefined" || !isLiveEditorEnabled()) {
    return depthLayerDefaults
  }
  try {
    const raw = localStorage.getItem(DEPTH_LAYERS_STORAGE_KEY)
    if (raw === snapshotKey) return snapshot
    snapshot = parseDepthLayers(raw)
    snapshotKey = raw
    return snapshot
  } catch {
    return depthLayerDefaults
  }
}

export function writeDepthLayers(next: DepthLayerToggles) {
  if (typeof window === "undefined") return
  snapshot = next
  try {
    const raw = JSON.stringify(next)
    snapshotKey = raw
    localStorage.setItem(DEPTH_LAYERS_STORAGE_KEY, raw)
  } catch {
    snapshotKey = null
  }
  window.dispatchEvent(new Event("rs-depth-layers"))
}

export function subscribeDepthLayers(onStoreChange: () => void) {
  const handler = () => onStoreChange()
  window.addEventListener("storage", handler)
  window.addEventListener("rs-depth-layers", handler)
  return () => {
    window.removeEventListener("storage", handler)
    window.removeEventListener("rs-depth-layers", handler)
  }
}

/** @deprecated Use depthLayerDefaults or useDepthLayers(). Kept as a static fallback. */
export const endingLayerToggles = depthLayerDefaults

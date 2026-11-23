/**
 * Depth map (far → near). Each layer has its own speed and direction
 * so stacked layers read as real parallax. Toggle them independently
 * or apply a preset to compare combinations. Stubs are no-ops until built.
 *
 * Background is a single choice (none | aurora | circuit), not a stack.
 *
 * Layer              | z    | speed         | direction            | blur      | default
 * -------------------|------|---------------|----------------------|-----------|----------
 * Background         | 0    | ~0.22–0.28x   | slow rise / drift    | soft CSS  | circuit
 * Ambient words      | 0    | ~0.25–0.35x   | left (slow cruise)   | 2–3px     | off
 * Ending outline     | 1    | 0.40–0.55x    | right                | 0–1px     | off
 * Far glyphs         | 1    | ~0.45–0.58x   | up + left            | 2–3px     | on
 * Mid glyphs         | 2    | ~0.95–1.10x   | up + right / side    | 0.6–1px   | on
 * Near glyphs        | 3    | ~1.55–1.85x   | fall / opposite      | 0         | on
 * Heading / footer   | 30   | ~1.2x         | rise, then settle    | 0         | on
 * Image layer        | —    | stub          | —                    | —         | off
 * Quote marks        | —    | stub          | —                    | —         | off
 * Marquee            | —    | stub          | —                    | —         | off
 *
 * Glyphs are site-wide, parked in the outer ~25% gutters and corners
 * so the center reading column stays clear. Default preset: glyphs-only
 * (circuit grid + all three glyph bands). Flip Background in the panel
 * to compare aurora, circuit, or none.
 *
 * Presets: glyphs-only (default), minimal (near glyphs), words
 * (ambient only), glyphs+words, all (includes stubs).
 */

export const BACKGROUND_CHOICES = ["none", "aurora", "circuit"] as const

export type BackgroundChoice = (typeof BACKGROUND_CHOICES)[number]

export const BACKGROUND_LABELS: Record<BackgroundChoice, string> = {
  none: "None",
  aurora: "Aurora",
  circuit: "Circuit grid",
}

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

export const DEPTH_LAYER_LABELS: Record<DepthLayerKey, string> = {
  ambientOutline: "Ambient words",
  outlineWord: "Ending outline",
  farGlyphs: "Far glyphs",
  midGlyphs: "Mid glyphs",
  nearGlyphs: "Near glyphs",
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
  background: "none",
  ambientOutline: false,
  outlineWord: false,
  farGlyphs: false,
  midGlyphs: false,
  nearGlyphs: false,
  imageLayer: false,
  quoteMarks: false,
  marquee: false,
}

export const depthLayerDefaults: DepthLayerToggles = {
  ...off,
  background: "circuit",
  farGlyphs: true,
  midGlyphs: true,
  nearGlyphs: true,
}

export const depthLayerPresets = {
  "glyphs-only": { ...depthLayerDefaults },
  minimal: { ...off, nearGlyphs: true },
  words: { ...off, ambientOutline: true },
  "glyphs+words": {
    ...depthLayerDefaults,
    ambientOutline: true,
    outlineWord: true,
  },
  all: {
    ...depthLayerDefaults,
    ambientOutline: true,
    outlineWord: true,
    imageLayer: true,
    quoteMarks: true,
    marquee: true,
  },
} as const satisfies Record<string, DepthLayerToggles>

export type DepthLayerPreset = keyof typeof depthLayerPresets

export const DEPTH_LAYER_PRESET_LABELS: Record<DepthLayerPreset, string> = {
  "glyphs-only": "glyphs-only",
  minimal: "minimal",
  words: "words",
  "glyphs+words": "glyphs+words",
  all: "all",
}

/** Bump this to ignore stale localStorage from earlier default mixes. */
export const DEPTH_LAYERS_STORAGE_VERSION = 4
export const DEPTH_LAYERS_STORAGE_KEY = "rs-depth-layers"

export function isLiveEditorEnabled() {
  if (typeof window === "undefined") return false
  return (
    process.env.NODE_ENV === "development" ||
    new URLSearchParams(window.location.search).has("layers")
  )
}

export function isBackgroundChoice(value: unknown): value is BackgroundChoice {
  return (
    value === "none" || value === "aurora" || value === "circuit"
  )
}

function pack(layers: DepthLayerToggles) {
  return JSON.stringify({ v: DEPTH_LAYERS_STORAGE_VERSION, ...layers })
}

function isCurrentVersion(parsed: unknown): parsed is Record<string, unknown> {
  return (
    !!parsed &&
    typeof parsed === "object" &&
    (parsed as { v?: unknown }).v === DEPTH_LAYERS_STORAGE_VERSION
  )
}

export function parseDepthLayers(raw: string | null): DepthLayerToggles {
  const next = { ...depthLayerDefaults }
  if (!raw) return next
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isCurrentVersion(parsed)) return { ...depthLayerDefaults }
    if (isBackgroundChoice(parsed.background)) {
      next.background = parsed.background
    }
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
    let parsedUnknown: unknown = null
    if (raw) {
      try {
        parsedUnknown = JSON.parse(raw)
      } catch {
        parsedUnknown = null
      }
    }
    if (raw && !isCurrentVersion(parsedUnknown)) {
      const packed = pack(depthLayerDefaults)
      localStorage.setItem(DEPTH_LAYERS_STORAGE_KEY, packed)
      snapshot = { ...depthLayerDefaults }
      snapshotKey = packed
      return snapshot
    }
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
    const raw = pack(next)
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

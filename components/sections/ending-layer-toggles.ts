/**
 * Independent on/off switches for depth layers.
 * Site-wide ambient outline is included here so every layer can be
 * tried or turned off independently.
 */
export const endingLayerToggles = {
  foregroundGlyphs: true,
  outlineWord: true,
  ambientOutline: true,
  imageLayer: false,
  quoteMarks: false,
  marquee: false,
} as const

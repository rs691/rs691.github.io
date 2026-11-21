/**
 * Independent on/off switches for ending-sequence depth layers.
 * Add new layers here so they can be tried one at a time.
 */
export const endingLayerToggles = {
  foregroundGlyphs: true,
  outlineWord: false,
  imageLayer: false,
  quoteMarks: false,
  marquee: false,
} as const

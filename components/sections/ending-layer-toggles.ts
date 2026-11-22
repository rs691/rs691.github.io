/**
 * Back-compat re-export. The depth map, presets, and live toggles live
 * in `@/lib/depth-layers`. Prefer useDepthLayers() for runtime switches.
 */
export {
  depthLayerDefaults,
  depthLayerDefaults as endingLayerToggles,
  depthLayerPresets,
  DEPTH_LAYER_KEYS,
  type DepthLayerToggles,
} from "@/lib/depth-layers"

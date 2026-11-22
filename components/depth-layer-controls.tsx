"use client"

import { DepthLayerPanel } from "@/components/depth-layer-panel"
import { useDepthLayers } from "@/components/depth-layer-provider"

/**
 * Renders the layer panel only in development, or in any build when
 * the URL contains ?layers. Production visitors never see it.
 */
export function DepthLayerControls() {
  const { editor } = useDepthLayers()
  if (!editor) return null
  return <DepthLayerPanel />
}

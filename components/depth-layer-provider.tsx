"use client"

import type { ReactNode } from "react"

import { depthLayerDefaults, type DepthLayerToggles } from "@/lib/depth-layers"

/**
 * Returns the fixed site-wide depth mix. There is no live editor and
 * no localStorage override — visitors always get depthLayerDefaults.
 */
export function useDepthLayers(): { layers: DepthLayerToggles } {
  return { layers: depthLayerDefaults }
}

export function DepthLayerProvider({ children }: { children: ReactNode }) {
  return children
}

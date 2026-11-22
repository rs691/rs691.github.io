"use client"

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react"

import {
  depthLayerDefaults,
  depthLayerPresets,
  isLiveEditorEnabled,
  readDepthLayers,
  subscribeDepthLayers,
  writeDepthLayers,
  type DepthLayerKey,
  type DepthLayerPreset,
  type DepthLayerToggles,
} from "@/lib/depth-layers"

type DepthLayerContextValue = {
  layers: DepthLayerToggles
  editor: boolean
  setLayer: (key: DepthLayerKey, value: boolean) => void
  toggleLayer: (key: DepthLayerKey) => void
  applyPreset: (preset: DepthLayerPreset) => void
  reset: () => void
}

const DepthLayerContext = createContext<DepthLayerContextValue | null>(null)

function subscribeEditor(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange)
  window.addEventListener("hashchange", onStoreChange)
  return () => {
    window.removeEventListener("popstate", onStoreChange)
    window.removeEventListener("hashchange", onStoreChange)
  }
}

export function DepthLayerProvider({ children }: { children: ReactNode }) {
  const editor = useSyncExternalStore(
    subscribeEditor,
    isLiveEditorEnabled,
    () => false
  )
  const layers = useSyncExternalStore(
    subscribeDepthLayers,
    readDepthLayers,
    () => depthLayerDefaults
  )

  const setLayer = useCallback(
    (key: DepthLayerKey, value: boolean) => {
      writeDepthLayers({ ...layers, [key]: value })
    },
    [layers]
  )
  const toggleLayer = useCallback(
    (key: DepthLayerKey) => {
      writeDepthLayers({ ...layers, [key]: !layers[key] })
    },
    [layers]
  )
  const applyPreset = useCallback((preset: DepthLayerPreset) => {
    writeDepthLayers({ ...depthLayerPresets[preset] })
  }, [])
  const reset = useCallback(() => {
    writeDepthLayers({ ...depthLayerDefaults })
  }, [])

  const value = useMemo(
    () => ({ layers, editor, setLayer, toggleLayer, applyPreset, reset }),
    [layers, editor, setLayer, toggleLayer, applyPreset, reset]
  )

  return (
    <DepthLayerContext.Provider value={value}>
      {children}
    </DepthLayerContext.Provider>
  )
}

export function useDepthLayers() {
  const context = useContext(DepthLayerContext)
  if (!context) {
    return {
      layers: depthLayerDefaults,
      editor: false,
      setLayer: () => {},
      toggleLayer: () => {},
      applyPreset: () => {},
      reset: () => {},
    } satisfies DepthLayerContextValue
  }
  return context
}

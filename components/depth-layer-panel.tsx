"use client"

import { useState } from "react"

import { useDepthLayers } from "@/components/depth-layer-provider"
import {
  BACKGROUND_CHOICES,
  BACKGROUND_LABELS,
  DEPTH_LAYER_KEYS,
  DEPTH_LAYER_LABELS,
  DEPTH_LAYER_PRESET_LABELS,
  DEPTH_LAYER_STUBS,
  depthLayerPresets,
  type DepthLayerPreset,
} from "@/lib/depth-layers"
import { cn } from "@/lib/utils"

/**
 * Dev / ?layers control surface. Lets Robert peel layers on and off
 * live, with presets, without editing source. Hidden in production
 * unless the URL contains ?layers.
 */
export function DepthLayerPanel() {
  const { layers, toggleLayer, setBackground, applyPreset, reset } =
    useDepthLayers()
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  )
  const presets = Object.keys(depthLayerPresets) as DepthLayerPreset[]

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="fixed top-4 left-4 z-[80] rounded-full border max-md:top-auto max-md:bottom-24 border-black/10 bg-background/90 px-3 py-1.5 font-mono text-[0.65rem] tracking-wide text-foreground shadow-lg backdrop-blur-md dark:border-white/10"
      >
        Layers
      </button>
    )
  }

  return (
    <div
      role="region"
      aria-label="Depth layer controls"
      className="fixed top-4 left-4 z-[80] w-[16.5rem] rounded-2xl border max-md:top-auto max-md:bottom-24 border-black/10 bg-background/90 p-3 text-foreground shadow-[0_16px_40px_-16px_rgba(0,0,0,.45)] backdrop-blur-md dark:border-white/10"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
          Layers
        </p>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="font-mono text-[0.65rem] text-muted-foreground hover:text-foreground"
        >
          Hide
        </button>
      </div>
      <div className="mb-3 flex flex-wrap gap-1">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => applyPreset(preset)}
            className="rounded-full border border-black/10 px-2 py-0.5 font-mono text-[0.6rem] tracking-wide hover:bg-foreground hover:text-background dark:border-white/10"
          >
            {DEPTH_LAYER_PRESET_LABELS[preset]}
          </button>
        ))}
      </div>
      <fieldset className="mb-3">
        <legend className="mb-1.5 font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
          Background
        </legend>
        <div className="flex flex-col gap-1.5">
          {BACKGROUND_CHOICES.map((choice) => (
            <label
              key={choice}
              className="flex cursor-pointer items-center gap-2 font-mono text-[0.7rem]"
            >
              <input
                type="radio"
                name="rs-background"
                checked={layers.background === choice}
                onChange={() => setBackground(choice)}
                className="size-3.5 accent-emerald-600"
              />
              <span>{BACKGROUND_LABELS[choice]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <ul className="flex flex-col gap-1.5">
        {DEPTH_LAYER_KEYS.map((key) => {
          const stub = DEPTH_LAYER_STUBS.includes(key)
          return (
            <li key={key}>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-2 font-mono text-[0.7rem]",
                  stub && "text-muted-foreground"
                )}
              >
                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={() => toggleLayer(key)}
                  className="size-3.5 accent-violet-500"
                />
                <span>{DEPTH_LAYER_LABELS[key]}</span>
              </label>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        onClick={reset}
        className="mt-3 font-mono text-[0.6rem] tracking-wide text-muted-foreground hover:text-foreground"
      >
        Reset defaults
      </button>
    </div>
  )
}

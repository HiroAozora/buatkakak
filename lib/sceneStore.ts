'use client'
import { createContext, useContext } from 'react'

export type SceneStore = {
  scene: number
  goTo: (n: number) => void
  next: () => void
  playing: boolean
  toggleAudio: () => void
}

export const SceneContext = createContext<SceneStore>({
  scene: 1,
  goTo: () => {},
  next: () => {},
  playing: false,
  toggleAudio: () => {},
})

export function useScene() {
  return useContext(SceneContext)
}

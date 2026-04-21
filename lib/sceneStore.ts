'use client'
import { createContext, useContext } from 'react'

export type SceneStore = {
  scene: number
  goTo: (n: number) => void
  next: () => void
}

export const SceneContext = createContext<SceneStore>({
  scene: 1,
  goTo: () => {},
  next: () => {},
})

export function useScene() {
  return useContext(SceneContext)
}

'use client'
import { useState } from 'react'
import { SceneContext } from '@/lib/sceneStore'
import OpeningScene      from '@/components/scenes/OpeningScene'
import PathGameScene     from '@/components/scenes/PathGameScene'
import FakeEndingScene   from '@/components/scenes/FakeEndingScene'
import RevisiTwistScene  from '@/components/scenes/RevisiTwistScene'
import PuzzleScene       from '@/components/scenes/PuzzleScene'
import CinematicScene    from '@/components/scenes/CinematicScene'
import FinalMessageScene from '@/components/scenes/FinalMessageScene'

export default function Home() {
  const [scene, setScene] = useState(1)
  const goTo = (n: number) => setScene(n)
  const next  = () => setScene(s => s + 1)

  return (
    <SceneContext.Provider value={{ scene, goTo, next }}>
      <main className="relative min-h-dvh w-full overflow-hidden">
        {scene === 1 && <OpeningScene />}
        {scene === 2 && <PathGameScene />}
        {scene === 3 && <FakeEndingScene />}
        {scene === 4 && <RevisiTwistScene />}
        {scene === 5 && <PuzzleScene />}
        {scene === 6 && <CinematicScene />}
        {scene === 7 && <FinalMessageScene />}
      </main>
    </SceneContext.Provider>
  )
}

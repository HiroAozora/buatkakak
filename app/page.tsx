'use client'
import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SceneContext } from '@/lib/sceneStore'
import { useAudio } from '@/lib/useAudio'
import DynamicIsland    from '@/components/ui/DynamicIsland'
import OpeningScene     from '@/components/scenes/OpeningScene'
import PathGameScene    from '@/components/scenes/PathGameScene'
import FakeEndingScene  from '@/components/scenes/FakeEndingScene'
import RevisiTwistScene from '@/components/scenes/RevisiTwistScene'
import PuzzleScene      from '@/components/scenes/PuzzleScene'
import CinematicScene   from '@/components/scenes/CinematicScene'
import FinalMessageScene from '@/components/scenes/FinalMessageScene'

// Fade wrapper so every scene transition is smooth (no blink)
function SceneFade({ children, id }: { children: React.ReactNode; id: number }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'absolute', inset: 0 }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const [scene, setScene] = useState(1)
  const { playing, toggle } = useAudio('/music/music.mp3')

  const goTo = (n: number) => setScene(n)
  const next  = () => setScene(s => s + 1)

  const handleDiToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    toggle()
  }, [toggle])

  return (
    <SceneContext.Provider value={{ scene, goTo, next, playing, toggleAudio: toggle }}>
      {/* DynamicIsland — global, persists once music starts */}
      <DynamicIsland
        playing={playing}
        onToggle={handleDiToggle}
        visible={playing || scene > 1}
      />

      <main className="relative min-h-dvh w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {scene === 1 && <SceneFade id={1}><OpeningScene /></SceneFade>}
          {scene === 2 && <SceneFade id={2}><PathGameScene /></SceneFade>}
          {scene === 3 && <SceneFade id={3}><FakeEndingScene /></SceneFade>}
          {scene === 4 && <SceneFade id={4}><RevisiTwistScene /></SceneFade>}
          {scene === 5 && <SceneFade id={5}><PuzzleScene /></SceneFade>}
          {scene === 6 && <SceneFade id={6}><CinematicScene /></SceneFade>}
          {scene === 7 && <SceneFade id={7}><FinalMessageScene /></SceneFade>}
        </AnimatePresence>
      </main>
    </SceneContext.Provider>
  )
}

'use client'
import { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useScene } from '@/lib/sceneStore'
import { useAudio } from '@/lib/useAudio'
import DynamicIsland from '@/components/ui/DynamicIsland'

function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 90 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.6,
      delay: Math.random() * 5,
      dur: Math.random() * 3 + 2,
    })), [])

  return (
    <>
      {stars.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            willChange: 'transform, opacity', transform: 'translateZ(0)',
          }}
          animate={{ opacity: [0.15, 0.9, 0.15], scale: [1, 1.5, 1] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}
    </>
  )
}

export default function OpeningScene() {
  const { next } = useScene()
  const { playing, toggle } = useAudio('/music.mp3')

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    toggle()
  }, [toggle])

  return (
    <motion.div
      className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden cursor-pointer select-none"
      style={{ background: 'radial-gradient(ellipse at 50% 25%, #1e0a3c 0%, #0d0520 40%, #07070f 100%)' }}
      onClick={next}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Stars />

      {/* Glow blobs */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-rose-900/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-900/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-900/15 blur-3xl pointer-events-none" />

      {/* Dynamic Island */}
      <DynamicIsland playing={playing} onToggle={handleToggle} />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-6">

        {/* Cake emoji float */}
        <motion.div
          className="text-6xl"
          animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        >
          🎂
        </motion.div>

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: 'easeOut' }}
          className="space-y-4"
        >
          <motion.p
            className="text-white/35 text-xs tracking-[0.35em] uppercase font-light"
            animate={{ opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            untuk kak yipdaa
          </motion.p>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white"
            style={{ textShadow: '0 0 60px rgba(232, 121, 249, 0.25)' }}
          >
            sebuah hadiah{' '}
            <span
              className="font-bold"
              style={{
                background: 'linear-gradient(135deg, #fda4af, #c084fc, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              kecil
            </span>
          </h1>

          <motion.p
            className="text-white/40 text-base font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            dari seseorang yang peduli 💜
          </motion.p>
        </motion.div>

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.8 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/20" />
          <motion.p
            className="text-white/45 text-sm font-light tracking-wide"
            animate={{ opacity: [0.45, 0.85, 0.45] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🎵 Lagunya klik dlu yaa kak
          </motion.p>
          <motion.p
            className="text-white/25 text-xs font-light mt-1"
            animate={{ opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
          >
            tap mana aja buat lanjut →
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #07070f, transparent)' }} />
    </motion.div>
  )
}

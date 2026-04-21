'use client'
import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScene } from '@/lib/sceneStore'
import Image from 'next/image'

const GRID = 3
const TOTAL = GRID * GRID
const SIZE  = 100
const IMG   = '/images/kakak/foto.png'

function shuffle(arr: number[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pieceStyle(id: number) {
  return {
    backgroundImage: `url(${IMG})`,
    backgroundSize: `${SIZE * GRID}px ${SIZE * GRID}px`,
    backgroundPosition: `-${(id % GRID) * SIZE}px -${Math.floor(id / GRID) * SIZE}px`,
    width: SIZE, height: SIZE,
  }
}

export default function PuzzleScene() {
  const { next } = useScene()
  const [pieces, setPieces]   = useState(() => shuffle(Array.from({ length: TOTAL }, (_, i) => i)))
  const [selected, setSelected] = useState<number | null>(null)
  const [snapping, setSnapping] = useState<Set<number>>(new Set())
  const [completed, setCompleted] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const handleClick = useCallback((pos: number) => {
    if (completed) return
    if (selected === null) { setSelected(pos); return }
    if (selected === pos)  { setSelected(null); return }

    setPieces(prev => {
      const next = [...prev]
      ;[next[selected], next[pos]] = [next[pos], next[selected]]
      const snaps = new Set<number>()
      if (next[selected] === selected) snaps.add(selected)
      if (next[pos]      === pos)      snaps.add(pos)
      if (snaps.size) {
        setSnapping(s => new Set([...s, ...snaps]))
        setTimeout(() => setSnapping(s => {
          const ns = new Set(s); snaps.forEach(i => ns.delete(i)); return ns
        }), 700)
      }
      return next
    })
    setSelected(null)
  }, [selected, completed])

  useEffect(() => {
    if (pieces.every((id, pos) => id === pos) && !completed) {
      setCompleted(true)
      setTimeout(() => setShowOverlay(true), 800)
      setTimeout(() => next(), 3000)
    }
  }, [pieces, completed, next])

  return (
    <motion.div
      className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a0832 0%, #07070f 70%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div className="text-center" style={{ marginBottom: "4rem" }}
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <p className="text-white/35 text-xs tracking-[0.3em] uppercase mb-2">Stage 5</p>
        <h2 className="text-2xl font-semibold text-white">Susun Fotonya! 🧩</h2>
        <p className="text-white/40 text-sm font-light mt-1">Tap dua keping buat nuker posisi</p>
      </motion.div>

      {/* Puzzle Frame */}
      <div 
        className="p-3 md:p-4 rounded-2xl shadow-2xl z-10"
        style={{ 
          background: "rgba(255,255,255,0.03)", 
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)"
        }}
      >
        {/* Grid */}
        <div className="relative rounded overflow-hidden" style={{ width: SIZE * GRID, height: SIZE * GRID }}>
          {/* Grid lines */}
          {[1, 2].map(i => (
            <div key={`h${i}`} className="absolute w-full" style={{ top: i * SIZE, height: 1, background: 'rgba(255,255,255,0.12)', zIndex: 5, pointerEvents: 'none' }} />
          ))}
          {[1, 2].map(i => (
            <div key={`v${i}`} className="absolute h-full" style={{ left: i * SIZE, width: 1, background: 'rgba(255,255,255,0.12)', zIndex: 5, pointerEvents: 'none' }} />
          ))}

          {pieces.map((pieceId, pos) => {
            const isSel   = selected === pos
            const isSnap  = snapping.has(pos)
            const isRight = pieceId === pos
            return (
              <motion.div
                key={`pos-${pos}`}
                className="absolute cursor-pointer overflow-hidden"
                style={{
                  left: (pos % GRID) * SIZE,
                  top:  Math.floor(pos / GRID) * SIZE,
                  zIndex: isSel ? 10 : 1,
                  willChange: 'transform, opacity',
                  boxShadow: isSel
                    ? '0 0 0 3px rgba(192,132,252,0.9)'
                    : isRight
                    ? '0 0 0 2px rgba(52,211,153,0.5)'
                    : '0 0 0 1px rgba(255,255,255,0.08)',
                  ...pieceStyle(pieceId),
                }}
                animate={{
                  scale:  isSnap ? [1, 1.1, 1] : isSel ? 1.05 : 1,
                  filter: isSel
                    ? 'brightness(1.3)'
                    : isRight ? 'brightness(1.1)' : 'brightness(1)',
                }}
                transition={{ duration: isSnap ? 0.5 : 0.15 }}
                onClick={() => handleClick(pos)}
                whileTap={{ scale: 0.94 }}
              />
            )
          })}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2" style={{ marginTop: "3rem" }}>
        {pieces.map((id, pos) => (
          <div key={pos} className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{ background: id === pos ? 'rgba(52,211,153,0.8)' : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>

      {/* Completed overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-30"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            <motion.div className="px-10 py-8 rounded-3xl text-center"
              style={{ background: 'rgba(52,211,153,0.15)', backdropFilter: 'blur(20px)', border: '1px solid rgba(52,211,153,0.3)' }}
              initial={{ scale: 0.5 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.1 }}>
              <p className="text-5xl mb-3">🎉</p>
              <p className="text-white text-2xl font-semibold">Berhasil!</p>
              <p className="text-white/50 text-sm mt-1">Fotonya tersusun sempurna~</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

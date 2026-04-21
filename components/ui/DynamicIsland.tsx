'use client'
import { motion, AnimatePresence } from 'framer-motion'

const DELAYS = [0, 0.15, 0.05, 0.25, 0.1]

type Props = {
  playing: boolean
  onToggle: (e: React.MouseEvent) => void
}

export default function DynamicIsland({ playing, onToggle }: Props) {
  return (
    <motion.div
      className="fixed top-4 left-1/2 z-50"
      style={{ transform: 'translateX(-50%) translateZ(0)', willChange: 'transform, opacity' }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.4 }}
    >
      <motion.button
        onClick={onToggle}
        className="flex items-center gap-3 px-5 py-3 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl cursor-pointer select-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        style={{ willChange: 'transform', transform: 'translateZ(0)', minHeight: 44 }}
      >
        {/* Play / Pause icon */}
        <div className="w-4 h-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {playing ? (
              <motion.svg key="pause" className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 24 24"
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}>
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </motion.svg>
            ) : (
              <motion.svg key="play" className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 24 24"
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}>
                <path d="M8 5v14l11-7z"/>
              </motion.svg>
            )}
          </AnimatePresence>
        </div>

        {/* Waveform bars */}
        <div className="flex items-center gap-[3px]" style={{ height: 20 }}>
          {DELAYS.map((delay, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-gradient-to-t from-rose-500 to-rose-300 block"
              style={{ height: '100%', originY: 1, willChange: 'transform', transform: 'translateZ(0)' }}
              animate={playing ? { scaleY: [0.25, 1, 0.35, 0.9, 0.25] } : { scaleY: 0.25 }}
              transition={playing
                ? { duration: 0.8, repeat: Infinity, delay, ease: 'easeInOut' }
                : { duration: 0.3 }
              }
            />
          ))}
        </div>

        {/* Label */}
        <span className="text-xs text-white/50 font-medium tracking-wide">
          {playing ? 'Playing' : 'Music'}
        </span>
      </motion.button>
    </motion.div>
  )
}

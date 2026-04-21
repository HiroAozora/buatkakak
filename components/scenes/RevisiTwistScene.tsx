'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScene } from '@/lib/sceneStore'

const SHAKE_ANIMATE = {
  x:      [0, -14, 14, -10, 10, -6, 6, -3, 3, 0] as number[],
  y:      [0,   4, -4,   3, -3,  2, -2,  1, -1, 0] as number[],
  rotate: [0,  -3,  3,  -2,  2, -1,  1,  0,  0, 0] as number[],
}
const SHAKE_TRANSITION = { duration: 0.7, ease: 'easeInOut' as const }
const IDLE_ANIMATE  = { x: 0, y: 0, rotate: 0 }

export default function RevisiTwistScene() {
  const { next } = useScene()
  const [shaking, setShaking] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Short pause → shake → popup → advance
    const t1 = setTimeout(() => setShaking(true),   300)
    const t2 = setTimeout(() => { setShaking(false); setShowPopup(true) }, 1100)
    const t3 = setTimeout(() => next(), 3500)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [next])

  return (
    <motion.div
      className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden"
      style={{ background: '#07070f' }}
      animate={shaking ? SHAKE_ANIMATE : IDLE_ANIMATE}
      transition={shaking ? SHAKE_TRANSITION : { duration: 0.3 }}
      initial={{ opacity: 0 }}
    >
      {/* Full-screen fade in */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Red flash on shake */}
      <AnimatePresence>
        {shaking && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            style={{ background: 'rgba(239,68,68,0.12)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
        )}
      </AnimatePresence>

      {/* Soft bg glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%) translateZ(0)',
        }}
      />

      {/* Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="relative z-30 flex flex-col items-center gap-5 text-center px-8"
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            {/* Card */}
            <div
              className="px-8 py-7 rounded-3xl flex flex-col items-center gap-4"
              style={{
                background: 'rgba(239,68,68,0.12)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(239,68,68,0.25)',
                boxShadow: '0 0 60px rgba(239,68,68,0.15)',
              }}
            >
              <motion.div
                className="text-5xl"
                animate={{ rotate: [-10, 10, -10, 10, 0] }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                📋
              </motion.div>

              <div className="space-y-2">
                <p className="text-white/50 text-xs tracking-widest uppercase">
                  Plot twist...
                </p>
                <p className="text-white text-2xl md:text-3xl font-semibold leading-snug">
                  alaa ada revisi dikit
                </p>
                <p className="text-white/40 text-sm font-light">
                  (tenang, dikit aja kok~)
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex gap-2 mt-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-rose-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

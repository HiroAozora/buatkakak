'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useScene } from '@/lib/sceneStore'

// ─── Character data ─────────────────────────────────────────────────────────
const CHARS = [
  { id: 'senang', src: '/images/char/kak-yipda-senang.png', label: 'Kak Senang 😊', desc: 'Mood: Optimis!' },
  { id: 'sedih',  src: '/images/char/kak-yipda-sedih.png',  label: 'Kak Sedih 😢',  desc: 'Mood: Galau...' },
  { id: 'marah',  src: '/images/char/kak-yipda-marah.png',  label: 'Kak Marah 😤',  desc: 'Mood: Siap perang!' },
]

const FAIL_MSGS = [
  'Yah, revisi lagi 😔',
  'Belum ACC kayaknya…',
  'Coba lagi, bentar lagi bisa!',
  'Dospemnya galak banget 😩',
  'Semangat kak, hampir! 💪',
]

// ─── SVG Path definition ─────────────────────────────────────────────────────
// Viewbox 400×500. Path goes from bottom-left up through curves to top-right (goal)
const PATH_D =
  'M 60 440 C 60 380, 180 360, 180 300 C 180 240, 80 220, 100 160 C 120 100, 280 90, 320 60'

// Fall zone: center of the dangerous curve (approx t=0.45 on the path)
// We represent fall zones as {cx, cy, r} circles in SVG space
const FALL_ZONES = [
  { cx: 130, cy: 205, r: 38 },
]

// Goal position
const GOAL = { cx: 320, cy: 60, r: 28 }
// Start position
const START = { cx: 60, cy: 440 }

// ─── Utility: get point on SVG path at fraction t ────────────────────────────
function getPathPoint(pathEl: SVGPathElement, t: number) {
  const len = pathEl.getTotalLength()
  return pathEl.getPointAtLength(t * len)
}

// ─── CharSelect screen ────────────────────────────────────────────────────────
function CharSelect({ onSelect }: { onSelect: (c: typeof CHARS[0]) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-dvh w-full px-6 py-16"
      style={{ background: 'radial-gradient(ellipse at 50% 20%, #1a0a3c 0%, #07070f 70%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Stars bg (static, cheap) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              width: Math.random() * 1.5 + 0.5, height: Math.random() * 1.5 + 0.5,
              opacity: Math.random() * 0.4 + 0.1,
            }} />
        ))}
      </div>

      <motion.div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-lg"
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}>

        <div className="text-center space-y-2">
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase">Stage 2</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            Pilih{' '}
            <span style={{
              background: 'linear-gradient(135deg, #fda4af, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Karaktermu</span>
          </h2>
          <p className="text-white/40 text-sm font-light">Siapa yang mau hadapi sempro hari ini?</p>
        </div>

        {/* Character cards */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {CHARS.map((c, i) => (
            <motion.button
              key={c.id}
              onClick={() => onSelect(c)}
              onHoverStart={() => setHovered(c.id)}
              onHoverEnd={() => setHovered(null)}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border cursor-pointer select-none"
              style={{
                background: hovered === c.id
                  ? 'rgba(192, 132, 252, 0.15)'
                  : 'rgba(255,255,255,0.04)',
                borderColor: hovered === c.id
                  ? 'rgba(192,132,252,0.5)'
                  : 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                willChange: 'transform, opacity',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <Image
                  src={c.src} alt={c.label} fill
                  className="object-contain drop-shadow-xl"
                  sizes="96px"
                />
              </div>
              <div className="text-center">
                <p className="text-white text-xs font-medium leading-tight">{c.label}</p>
                <p className="text-white/40 text-[10px] mt-0.5">{c.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.p className="text-white/25 text-xs"
          animate={{ opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 3, repeat: Infinity }}>
          Tap karakter untuk mulai 👆
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// ─── PathGame screen ──────────────────────────────────────────────────────────
function PathGame({ char }: { char: typeof CHARS[0] }) {
  const { next } = useScene()

  const [pos, setPos] = useState({ x: START.cx, y: START.cy })
  const [inZone, setInZone] = useState(false)
  const [failMsg, setFailMsg] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([])
  const trailId = useRef(0)

  const pathRef = useRef<SVGPathElement>(null)
  const svgRef  = useRef<SVGSVGElement>(null)

  // Convert client XY → SVG coordinate
  const clientToSvg = useCallback((cx: number, cy: number) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = cx; pt.y = cy
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse())
    return { x: svgPt.x, y: svgPt.y }
  }, [])

  // Snap char to nearest point on path
  const snapToPath = useCallback((svgX: number, svgY: number) => {
    const pathEl = pathRef.current
    if (!pathEl) return { x: svgX, y: svgY, t: 0 }
    const len = pathEl.getTotalLength()
    let best = { x: svgX, y: svgY, t: 0, dist: Infinity }
    for (let i = 0; i <= 100; i++) {
      const t = i / 100
      const pt = pathEl.getPointAtLength(t * len)
      const d = Math.hypot(pt.x - svgX, pt.y - svgY)
      if (d < best.dist) best = { x: pt.x, y: pt.y, t, dist: d }
    }
    return best
  }, [])

  const reset = useCallback((msg: string) => {
    setFailMsg(msg)
    setAttempts(a => a + 1)
    setTrail([])
    setTimeout(() => {
      setPos({ x: START.cx, y: START.cy })
      setFailMsg(null)
    }, 1800)
  }, [])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (failMsg || completed) return
    const { x: svgX, y: svgY } = clientToSvg(clientX, clientY)
    const snapped = snapToPath(svgX, svgY)

    setPos({ x: snapped.x, y: snapped.y })

    // Add trail dot
    setTrail(prev => {
      const next = [...prev, { x: snapped.x, y: snapped.y, id: trailId.current++ }]
      return next.slice(-25)
    })

    // Check fall zone
    for (const zone of FALL_ZONES) {
      const dist = Math.hypot(snapped.x - zone.cx, snapped.y - zone.cy)
      if (dist < zone.r) {
        const msg = FAIL_MSGS[Math.floor(Math.random() * FAIL_MSGS.length)]
        reset(msg)
        return
      }
    }

    // Check goal
    const distGoal = Math.hypot(snapped.x - GOAL.cx, snapped.y - GOAL.cy)
    if (distGoal < GOAL.r + 10) {
      setCompleted(true)
      setTimeout(() => next(), 1200)
    }
  }, [failMsg, completed, clientToSvg, snapToPath, reset, next])

  // Pointer events
  const isDragging = useRef(false)

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    handleMove(e.clientX, e.clientY)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    handleMove(e.clientX, e.clientY)
  }
  const onPointerUp = () => { isDragging.current = false }

  return (
    <motion.div
      className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: 'radial-gradient(ellipse at 30% 60%, #0f1a3c 0%, #07070f 70%)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="absolute top-20 left-0 right-0 flex flex-col items-center gap-1 z-10 pointer-events-none">
        <p className="text-white/30 text-xs tracking-widest uppercase">Jalur Sempro</p>
        <h2 className="text-white text-lg font-semibold">Lewatin rintangannya, kak! 💪</h2>
        {attempts > 0 && (
          <p className="text-rose-400/70 text-xs">Percobaan ke-{attempts + 1}</p>
        )}
      </div>

      {/* SVG play field */}
      <div className="relative w-full max-w-sm" style={{ aspectRatio: '4/5' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 400 500"
          className="w-full h-full touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Path glow */}
          <path d={PATH_D} stroke="rgba(192,132,252,0.2)" strokeWidth="20" fill="none" strokeLinecap="round" />
          {/* Path main */}
          <path ref={pathRef} d={PATH_D} stroke="rgba(192,132,252,0.7)" strokeWidth="5"
            fill="none" strokeLinecap="round" strokeDasharray="8 6" />

          {/* Trail dots */}
          {trail.map((t, i) => (
            <circle key={t.id} cx={t.x} cy={t.y} r={3}
              fill="rgba(253, 164, 175, 0.4)"
              opacity={(i + 1) / trail.length}
            />
          ))}

          {/* Fall zone — dospem territory */}
          {FALL_ZONES.map((z, i) => (
            <g key={i}>
              <circle cx={z.cx} cy={z.cy} r={z.r} fill="rgba(239,68,68,0.15)"
                stroke="rgba(239,68,68,0.35)" strokeWidth="1.5" strokeDasharray="5 3" />
              {/* Dospem image via foreignObject */}
              <foreignObject x={z.cx - 28} y={z.cy - 34} width={56} height={56}>
                <div style={{ width: 56, height: 56, position: 'relative' }}>
                  <img
                    src="/images/char/dospem.png"
                    alt="Dospem"
                    style={{ width: '100%', height: '100%', objectFit: 'contain',
                      filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.6))' }}
                  />
                </div>
              </foreignObject>
              <text x={z.cx} y={z.cy + z.r + 12} textAnchor="middle"
                fill="rgba(239,68,68,0.7)" fontSize="9" fontFamily="system-ui">
                ⚠ zona dospem
              </text>
            </g>
          ))}

          {/* Goal */}
          <circle cx={GOAL.cx} cy={GOAL.cy} r={GOAL.r}
            fill={completed ? 'rgba(52,211,153,0.3)' : 'rgba(52,211,153,0.1)'}
            stroke={completed ? 'rgba(52,211,153,0.9)' : 'rgba(52,211,153,0.4)'}
            strokeWidth="2" />
          <text x={GOAL.cx} y={GOAL.cy + 4} textAnchor="middle"
            fill="rgba(52,211,153,0.9)" fontSize="14">
            🎓
          </text>

          {/* Start label */}
          <text x={START.cx} y={START.cy + 22} textAnchor="middle"
            fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="system-ui">
            Mulai
          </text>

          {/* Character — main avatar */}
          {!failMsg && (
            <foreignObject
              x={pos.x - 28} y={pos.y - 52} width={56} height={56}
              style={{ willChange: 'transform', overflow: 'visible' }}
            >
              <div style={{ width: 56, height: 56, position: 'relative' }}>
                <img
                  src={char.src}
                  alt={char.label}
                  style={{
                    width: '100%', height: '100%', objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(192,132,252,0.5))',
                  }}
                />
              </div>
            </foreignObject>
          )}

          {/* Completed burst */}
          {completed && (
            <>
              {[...Array(8)].map((_, i) => (
                <circle key={i}
                  cx={GOAL.cx + Math.cos(i * Math.PI / 4) * 40}
                  cy={GOAL.cy + Math.sin(i * Math.PI / 4) * 40}
                  r={4} fill="rgba(52,211,153,0.8)" />
              ))}
            </>
          )}
        </svg>
      </div>

      {/* Hint */}
      <motion.p
        className="absolute bottom-8 text-white/30 text-xs text-center pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        Seret karakter ikutin jalur ungu ✨
      </motion.p>

      {/* Fail popup */}
      <AnimatePresence>
        {failMsg && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="px-6 py-4 rounded-2xl text-center"
              style={{
                background: 'rgba(239,68,68,0.15)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(239,68,68,0.3)',
              }}
              initial={{ scale: 0.7, y: 20 }}
              animate={{ scale: 1, y: 0, rotate: [-2, 2, -2, 0] }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <p className="text-white text-lg font-semibold">{failMsg}</p>
              <p className="text-white/50 text-xs mt-1">kembali ke awal…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed overlay */}
      <AnimatePresence>
        {completed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <motion.div
              className="px-8 py-6 rounded-3xl text-center"
              style={{
                background: 'rgba(52,211,153,0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(52,211,153,0.3)',
              }}
              initial={{ scale: 0.5 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <p className="text-4xl mb-2">🎓</p>
              <p className="text-white text-xl font-semibold">Berhasil!</p>
              <p className="text-white/60 text-sm mt-1">Kakak sampai di tujuan~</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function PathGameScene() {
  const [selectedChar, setSelectedChar] = useState<typeof CHARS[0] | null>(null)

  return (
    <AnimatePresence mode="wait">
      {!selectedChar ? (
        <motion.div key="select">
          <CharSelect onSelect={setSelectedChar} />
        </motion.div>
      ) : (
        <motion.div key="game">
          <PathGame char={selectedChar} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

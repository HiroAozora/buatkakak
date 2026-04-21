'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useScene } from '@/lib/sceneStore'

export default function CinematicScene() {
  const { next } = useScene()
  const fotoRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let tl: { kill: () => void } | null = null
    const t = setTimeout(() => next(), 5000)

    import('gsap').then(({ gsap }) => {
      tl = gsap.timeline()
      gsap.to(fotoRef.current, {
        scale: 0.82,
        duration: 2,
        delay: 0.8,
        ease: 'power2.inOut',
        willChange: 'transform',
      })
    })

    return () => {
      clearTimeout(t)
      tl?.kill()
    }
  }, [next])

  return (
    <motion.div
      className="relative min-h-dvh w-full flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Warm gradient bg */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #2d1500 0%, #1a0a2e 55%, #07070f 100%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 2 }}
      />

      {/* Gold glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(251,191,36,0.07) 0%, transparent 65%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 2.5 }}
      />

      {/* Photo */}
      <div
        ref={fotoRef}
        className="relative z-10"
        style={{
          width: 300, height: 300,
          borderRadius: 16,
          overflow: 'hidden',
          willChange: 'transform',
          transform: 'translateZ(0)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(251,191,36,0.10)',
        }}
      >
        <Image
          src="/images/kakak/foto.png"
          alt="Foto kakak"
          fill
          className="object-cover"
          sizes="300px"
          priority
        />
      </div>

      {/* Caption */}
      <motion.p
        className="relative z-10 mt-8 text-white/35 text-sm font-light tracking-wide"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        puzzle selesai ✨
      </motion.p>
    </motion.div>
  )
}

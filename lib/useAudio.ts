'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export function useAudio(src: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const howlRef = useRef<any>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    import('howler').then(({ Howl }) => {
      if (!mounted) return
      howlRef.current = new Howl({
        src: [src],
        loop: true,
        volume: 0.6,
        onplay:  () => setPlaying(true),
        onpause: () => setPlaying(false),
        onstop:  () => setPlaying(false),
        onload:  () => setReady(true),
      })
    })
    return () => {
      mounted = false
      howlRef.current?.unload()
    }
  }, [src])

  const toggle = useCallback(() => {
    if (!howlRef.current) return
    if (playing) howlRef.current.pause()
    else         howlRef.current.play()
  }, [playing])

  return { playing, toggle, ready }
}

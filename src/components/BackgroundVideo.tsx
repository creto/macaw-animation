import { useCallback, useEffect, useRef } from 'react'

const VIDEO_SRC = '/macaw.mp4'
const SEEK_EPSILON = 0.02

/**
 * Right-side macaw: taller than pure contain, a bit smaller than full half-page cover.
 * ~90vh cover scaled to ~0.92 so the bird reads big/tall without the old full crop.
 */
export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetTimeRef = useRef(0)
  const isSeekingRef = useRef(false)
  const rafRef = useRef(0)

  const seek = useCallback(() => {
    const video = videoRef.current
    if (!video || isSeekingRef.current) return
    if (Math.abs(video.currentTime - targetTimeRef.current) < SEEK_EPSILON) return
    isSeekingRef.current = true
    video.currentTime = targetTimeRef.current
  }, [])

  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false
    seek()
  }, [seek])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const video = videoRef.current
      if (!video) return

      const { duration } = video
      if (!Number.isFinite(duration) || duration <= 0) return

      const x = Math.min(Math.max(event.clientX / window.innerWidth, 0), 1)
      targetTimeRef.current = (1 - x) * duration

      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(seek)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [seek])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 right-0 z-0 flex items-center justify-end overflow-hidden"
      style={{
        left: '42%',
        width: '58%',
        background: 'var(--macaw-sky)',
      }}
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
        onLoadedMetadata={() => {
          const video = videoRef.current
          if (!video || !Number.isFinite(video.duration)) return
          targetTimeRef.current = video.duration * 0.5
          video.currentTime = targetTimeRef.current
        }}
        style={{
          // Mid size: almost half-page cover height, not tiny contain
          height: '92vh',
          width: '100%',
          objectFit: 'cover',
          objectPosition: '62% center',
          transform: 'scale(0.92) translateX(3%)',
          transformOrigin: 'center right',
        }}
      />
    </div>
  )
}

import { useCallback, useEffect, useRef } from 'react'

const VIDEO_SRC = '/macaw.mp4'
const SEEK_EPSILON = 0.02

/**
 * Medium macaw on the right over the sky fill.
 * Absolute scrub: mouse X maps to playhead so the bird looks toward the cursor
 * (clip starts facing right / ends facing left → invert X).
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

      // 0 at left edge → 1 at right. Clip faces right at t=0 and left at t=end.
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
      className="pointer-events-none fixed z-0 overflow-hidden"
      style={{
        right: 'clamp(0.75rem, 3vw, 2.5rem)',
        bottom: 'clamp(1rem, 4vh, 3rem)',
        top: 'auto',
        // Medium: bigger than before, not full-bleed
        width: 'min(58vw, 640px)',
        maxHeight: 'min(72vh, 560px)',
        aspectRatio: '16 / 9',
        background: 'transparent',
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
          // Start mid-turn / facing somewhat toward center
          targetTimeRef.current = video.duration * 0.5
          video.currentTime = targetTimeRef.current
        }}
        className="h-full w-full"
        style={{
          objectFit: 'contain',
          objectPosition: 'center bottom',
        }}
      />
    </div>
  )
}

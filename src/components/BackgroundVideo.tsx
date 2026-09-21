import { useCallback, useEffect, useRef } from 'react'

const VIDEO_SRC = '/macaw.mp4'
const SEEK_EPSILON = 0.02

/**
 * Full-height macaw from mid-page to the right (original cover feel, right half only).
 * Absolute scrub: mouse X → playhead so the bird looks toward the cursor
 * (clip faces right at t=0, left at end → invert X).
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
      className="pointer-events-none fixed inset-y-0 right-0 z-0 overflow-hidden"
      style={{
        left: '50%',
        width: '50%',
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
        className="h-full w-full"
        style={{
          objectFit: 'cover',
          objectPosition: 'center center',
        }}
      />
    </div>
  )
}

import { useCallback, useEffect, useRef } from 'react'

const VIDEO_SRC = '/macaw.mp4'

/** How much of the clip a full-width mouse sweep scrubs through. */
const SENSITIVITY = 0.8
/** Seeks closer than this are not worth a round trip. */
const SEEK_EPSILON = 0.01

/**
 * Compact macaw scrubber on the right. Page sky fills the rest.
 * Scrub direction matches mouse: move left → earlier frames (head follows left).
 */
export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetTimeRef = useRef(0)
  const isSeekingRef = useRef(false)
  const prevXRef = useRef<number | null>(null)

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
      if (!Number.isFinite(duration) || duration <= 0) {
        prevXRef.current = event.clientX
        return
      }

      if (prevXRef.current === null) {
        prevXRef.current = event.clientX
        return
      }

      const delta = event.clientX - prevXRef.current
      prevXRef.current = event.clientX

      // Negate so left mouse motion scrubs toward the left-facing pose.
      const offset = (-delta / window.innerWidth) * SENSITIVITY * duration
      targetTimeRef.current = Math.min(
        Math.max(targetTimeRef.current + offset, 0),
        duration,
      )

      seek()
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [seek])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-0 overflow-hidden rounded-2xl shadow-sm"
      style={{
        // Keep clear of left copy (max-w-xl + padding) and edges
        right: 'clamp(1rem, 4vw, 3rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 'min(38vw, 420px)',
        aspectRatio: '16 / 9',
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
        className="h-full w-full"
        style={{
          objectFit: 'contain',
          objectPosition: 'center center',
        }}
      />
    </div>
  )
}

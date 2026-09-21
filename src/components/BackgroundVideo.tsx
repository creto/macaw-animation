import { useCallback, useEffect, useRef } from 'react'

const VIDEO_SRC = '/macaw.mp4'

/** How much of the clip a full-width mouse sweep scrubs through. */
const SENSITIVITY = 0.8
/** Seeks closer than this are not worth a round trip. */
const SEEK_EPSILON = 0.01

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  /** Where we want the playhead to be; the mouse writes here, seeks chase it. */
  const targetTimeRef = useRef(0)
  /** True while a seek is in flight, so we never flood the decoder. */
  const isSeekingRef = useRef(false)
  const prevXRef = useRef<number | null>(null)

  const seek = useCallback(() => {
    const video = videoRef.current
    if (!video || isSeekingRef.current) return
    if (Math.abs(video.currentTime - targetTimeRef.current) < SEEK_EPSILON) return
    isSeekingRef.current = true
    video.currentTime = targetTimeRef.current
  }, [])

  // Once a seek lands, chase the target again if the mouse moved meanwhile.
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

      const offset = (delta / window.innerWidth) * SENSITIVITY * duration
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
    <video
      ref={videoRef}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
      onSeeked={handleSeeked}
      className="fixed inset-0 h-full w-full"
      style={{
        zIndex: 0,
        objectFit: 'cover',
        objectPosition: 'center center',
      }}
    />
  )
}

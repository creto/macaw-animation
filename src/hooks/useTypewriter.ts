import { useEffect, useState } from 'react'

export interface TypewriterState {
  displayed: string
  done: boolean
}

/**
 * Reveals `text` one character at a time after `startDelay` ms,
 * at `speed` ms per character.
 */
export function useTypewriter(
  text: string,
  speed = 38,
  startDelay = 600,
): TypewriterState {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)

    let intervalId: number | undefined

    const timeoutId = window.setTimeout(() => {
      let index = 0
      intervalId = window.setInterval(() => {
        index += 1
        setDisplayed(text.slice(0, index))
        if (index >= text.length) {
          window.clearInterval(intervalId)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId !== undefined) window.clearInterval(intervalId)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}

import { useEffect, useState } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'

const TYPED_TEXT =
  'Glad you stopped in. Good taste tends to find us. Now, what are we building?'

const EMAIL = 'hello@mainframe.co'

const ACTIONS = [
  'Pitch us an idea',
  'Come work here',
  'Send a brief hello',
  'See how we operate',
]

const PILL_BASE =
  'inline-flex items-center justify-center rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] transition-colors duration-200'

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="1.5" y="1.5" width="7" height="7" rx="1" />
    </svg>
  )
}

export default function Hero() {
  const { displayed, done } = useTypewriter(TYPED_TEXT)
  // The pills arrive on their own timer -- they do not wait for the typing.
  const [actionsVisible, setActionsVisible] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setActionsVisible(true), 400)
    return () => window.clearTimeout(timeoutId)
  }, [])

  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL)
  }

  return (
    <section
      className="relative h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden w-full md:w-1/2"
      style={{ zIndex: 1 }}
    >
      <div className="max-w-xl relative z-10">
        <p
          className="pointer-events-none select-none mb-5 sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.3,
            fontWeight: 400,
            color: '#000',
            filter: 'blur(4px)',
          }}
        >
          Hey there, meet A.R.I.A,
          <br />
          Mainframe's Adaptive Response Interface Agent
        </p>

        <p
          className="text-black mb-5 sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.35,
            fontWeight: 400,
            minHeight: '54px',
          }}
        >
          {displayed}
          {!done && (
            <span className="cursor-blink inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px]" />
          )}
        </p>

        <div
          className="flex flex-wrap gap-y-1"
          style={{
            opacity: actionsVisible ? 1 : 0,
            transform: actionsVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {ACTIONS.map((label) => (
            <button
              key={label}
              type="button"
              className={`${PILL_BASE} bg-white text-black border border-black/10 hover:bg-black hover:text-white`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            onClick={copyEmail}
            aria-label={`Copy ${EMAIL} to clipboard`}
            className={`${PILL_BASE} gap-2 sm:gap-3 bg-transparent text-white border border-white hover:bg-white hover:text-black`}
            style={{ whiteSpace: 'nowrap' }}
          >
            <span>
              Reach us: <span className="underline underline-offset-1">{EMAIL}</span>
            </span>
            <CopyIcon />
          </button>
        </div>
      </div>
    </section>
  )
}

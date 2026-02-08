import { useEffect } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { initBootSound, playKeystroke, stopTyping } from '../lib/sounds'

const BOOT_LINES = [
  '[ OK ] ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL',
  '[ OK ] COPYRIGHT 2077 ROBCO INDUSTRIES',
  '',
  '[ OK ] User System Check',
  '[ OK ] Initializing portfolio kernel...',
  '[ OK ] Mounting /projects',
  '[ OK ] Loading thumbnails...',
  '[ OK ] Establishing uplink...',
  '',
  'MARTIN ORAV — PERSONAL TERMINAL v2.6.0',
  '',
  '> CONNECTION ESTABLISHED.',
  '> ACCESS: GRANTED',
  '',
]

/**
 * Full screen boot overlay. Types out init lines then fades to terminal.
 * Boot sound plays on the user's first click (browser autoplay policy).
 */
export default function BootScreen({ onComplete }) {
  const { displayed, done, skip } = useTypewriter(BOOT_LINES, 20)

  // Set up boot sound to play on first user interaction
  useEffect(() => {
    initBootSound()
  }, [])

  // Start typing sound when text starts appearing
  useEffect(() => {
    if (displayed.length > 0 && !done) {
      playKeystroke()
    }
  }, [displayed])

  // Stop typing sound when done
  useEffect(() => {
    if (done) {
      stopTyping()
      const t = setTimeout(onComplete, 800)
      return () => clearTimeout(t)
    }
  }, [done, onComplete])

  function handleSkip() {
    stopTyping()
    if (done) {
      onComplete()
    } else {
      skip()
    }
  }

  return (
    <div className="boot-overlay" onClick={handleSkip}>
      <div className="boot-content">
        {displayed.map((line, i) => (
          <div key={i} className="terminal__line">{line}</div>
        ))}
        {!done && <span className="cursor" />}
        {done && (
          <div style={{ marginTop: '12px', opacity: 0.5 }}>
            {'> Click anywhere to continue...'}
          </div>
        )}
      </div>
    </div>
  )
}
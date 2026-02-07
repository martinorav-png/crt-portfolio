import { useEffect } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { playBoot, playKeystroke } from '../lib/sounds'

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
 */
export default function BootScreen({ onComplete }) {
  const { displayed, done } = useTypewriter(BOOT_LINES, 20)

  useEffect(() => {
    playBoot()
  }, [])

  useEffect(() => {
    if (displayed.length > 0 && !done) {
      playKeystroke()
    }
  }, [displayed])

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 800)
      return () => clearTimeout(t)
    }
  }, [done, onComplete])

  return (
    <div className="boot-overlay" onClick={onComplete}>
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
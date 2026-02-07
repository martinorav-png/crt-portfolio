import { useEffect } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { BOOT_LINES } from '../data/sections'
import { playBoot, playKeystroke } from '../lib/sounds'

/**
 * Boot sequence screen. Types out ROBCO initialization lines.
 * Click anywhere to skip. Calls onComplete when done.
 */
export default function BootScreen({ onComplete }) {
  const { displayed, done } = useTypewriter(BOOT_LINES, 25)

  // Play boot sound on mount
  useEffect(() => {
    playBoot()
  }, [])

  // Play keystroke on each new character
  useEffect(() => {
    if (displayed.length > 0 && !done) {
      playKeystroke()
    }
  }, [displayed])

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 600)
      return () => clearTimeout(t)
    }
  }, [done, onComplete])

  return (
    <div onClick={onComplete} style={{ cursor: 'pointer', minHeight: '100%' }}>
      {displayed.map((line, i) => (
        <div key={i} className="terminal__line">{line}</div>
      ))}
      {!done && <span className="cursor" />}
    </div>
  )
}
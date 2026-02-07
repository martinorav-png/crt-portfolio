import { useRef, useEffect } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import { playKeystroke, playBack } from '../lib/sounds'
import MenuEntry from './MenuEntry'

/**
 * Renders a terminal section with typed content and optional menu entries.
 * Used for About, Skills, Contact, and the Projects hub.
 */
export default function ContentView({ title, path, lines, entries, onBack, onNavigate }) {
  const allLines = lines || []
  const { displayed, done, skip } = useTypewriter(allLines, 12, allLines.length > 0)

  // Play keystroke as text types
  useEffect(() => {
    if (displayed.length > 0 && !done) {
      playKeystroke()
    }
  }, [displayed])

  const scrollRef = useRef(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [displayed])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="terminal__topbar">
        <span className="terminal__path">
          {'TERMINAL://PORTFOLIO/' + path}
        </span>
        <button
          className="terminal__back-btn"
          onClick={() => {
            playBack()
            onBack()
          }}
        >
          {'[BACK]'}
        </button>
      </div>

      <div className="terminal__title">{'>'} {title}</div>

      <div
        ref={scrollRef}
        className="terminal__content"
        onClick={!done ? skip : undefined}
      >
        {displayed.map((line, i) => (
          <div key={'l-' + i} className="terminal__line">{line}</div>
        ))}

        {entries && entries.length > 0 && (done || allLines.length === 0) && (
          <div style={{ marginTop: '8px' }}>
            {entries.map((entry) => (
              <MenuEntry
                key={entry.key}
                label={entry.label}
                desc={entry.desc}
                onClick={() => onNavigate?.(entry.key)}
              />
            ))}
          </div>
        )}

        {done && (!entries || entries.length === 0) && (
          <div style={{ marginTop: '4px' }}>
            <span className="cursor" />
          </div>
        )}
      </div>
    </div>
  )
}
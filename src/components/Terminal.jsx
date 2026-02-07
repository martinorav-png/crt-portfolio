import { useState, useCallback } from 'react'
import CRTOverlay from './CRTOverlay'
import BootScreen from './BootScreen'
import ContentView from './ContentView'
import ProjectsView from './ProjectsView'
import MenuEntry from './MenuEntry'
import { useTypewriter } from '../hooks/useTypewriter'
import { MAIN_MENU, SECTIONS, PROJECT_CATEGORIES } from '../data/sections'

/**
 * Main terminal shell. Manages:
 * - Boot sequence → main menu
 * - Navigation stack (history-based back button)
 * - Routing to static sections and dynamic Supabase views
 */
export default function Terminal() {
  const [phase, setPhase] = useState('boot')
  const [history, setHistory] = useState(['main'])

  const current = history[history.length - 1]

  const navigate = useCallback((key) => {
    setHistory((h) => [...h, key])
  }, [])

  const goBack = useCallback(() => {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h))
  }, [])

  function renderContent() {
    if (current === 'main') {
      return <MainMenuView onNavigate={navigate} />
    }

    if (current === 'projects') {
      return (
        <ContentView
          title="PROJECTS"
          path="PROJECTS"
          lines={['PROJECT ARCHIVE — CLASSIFIED LEVEL: PUBLIC', '————————————————————————————————————']}
          entries={PROJECT_CATEGORIES}
          onBack={goBack}
          onNavigate={navigate}
        />
      )
    }

    const projectCat = PROJECT_CATEGORIES.find((c) => c.key === current)
    if (projectCat) {
      return (
        <ProjectsView
          title={projectCat.label.replace(/[\[\]]/g, '')}
          table={projectCat.table}
          category={projectCat.category}
          onBack={goBack}
        />
      )
    }

    const section = SECTIONS[current]
    if (section) {
      return (
        <ContentView
          title={section.title}
          path={section.title.replace(/ /g, '_')}
          lines={section.content}
          onBack={goBack}
        />
      )
    }

    return (
      <ContentView
        title="ERROR"
        path="ERROR"
        lines={['> SECTION NOT FOUND', '> RETURNING TO MAIN MENU...']}
        onBack={goBack}
      />
    )
  }

  return (
    <div className="monitor">
      <div className="monitor__bezel">
        <div className="monitor__led" />

        <div className="screen">
          <CRTOverlay />

          <div className="terminal">
            {phase === 'boot' ? (
              <BootScreen onComplete={() => setPhase('terminal')} />
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MainMenuView({ onNavigate }) {
  const { displayed, done } = useTypewriter(MAIN_MENU.header, 14)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="terminal__title">{'>'} {MAIN_MENU.title}</div>

      <div className="terminal__content">
        {displayed.map((line, i) => (
          <div key={i} className="terminal__line">{line}</div>
        ))}

        {done && (
          <div style={{ marginTop: '8px' }}>
            {MAIN_MENU.entries.map((entry) => (
              <MenuEntry
                key={entry.key}
                label={entry.label}
                desc={entry.desc}
                onClick={() => onNavigate(entry.key)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
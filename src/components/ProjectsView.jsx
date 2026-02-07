import { useState, useEffect } from 'react'
import { fetchProjects, fetchWorksByCategory } from '../lib/supabase'
import GalleryModal from './GalleryModal'

const INITIAL_ITEMS = 6

/**
 * Fetches and displays gallery items from Supabase.
 * Handles both 'projects' table (web apps) and 'works' table (by category).
 */
export default function ProjectsView({ title, table, category, onBack }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [modalItem, setModalItem] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      let data = []

      if (table === 'projects') {
        data = await fetchProjects()
      } else if (category) {
        data = await fetchWorksByCategory(category)
      }

      setItems(data)
      setLoading(false)
    }
    load()
  }, [table, category])

  const visibleItems = showAll ? items : items.slice(0, INITIAL_ITEMS)
  const hasMore = items.length > INITIAL_ITEMS && !showAll

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="terminal__topbar">
        <span className="terminal__path">
          {'TERMINAL://PORTFOLIO/PROJECTS/' + title.replace(/ /g, '_')}
        </span>
        <button className="terminal__back-btn" onClick={onBack}>
          {'[BACK]'}
        </button>
      </div>

      <div className="terminal__title">{'>'} {title}</div>

      <div className="terminal__content">
        {loading ? (
          <div className="terminal__line">
            {'> LOADING DATA FROM SUPABASE'}
            <span className="loading-dots" />
          </div>
        ) : items.length === 0 ? (
          <div className="terminal__line">{'> NO RECORDS FOUND.'}</div>
        ) : (
          <>
            <div className="terminal__line" style={{ marginBottom: '8px', opacity: 0.6 }}>
              {items.length} {'RECORD' + (items.length !== 1 ? 'S' : '') + ' FOUND'}
            </div>

            <div className="gallery-grid">
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="gallery-card"
                  onClick={() => setModalItem(item)}
                >
                  <div style={{ position: 'relative' }}>
                    {item.image_url && (
                      <>
                        <img
                          className="gallery-card__image"
                          src={item.image_url}
                          alt={item.title}
                          loading="lazy"
                        />
                        <div className="gallery-card__overlay" />
                        <div className="gallery-card__tint" />
                      </>
                    )}
                  </div>
                  <div className="gallery-card__title">{item.title}</div>
                </div>
              ))}
            </div>

            {hasMore && (
              <button
                className="show-more-btn"
                onClick={() => setShowAll(true)}
              >
                {'[SHOW ALL ' + items.length + ' ITEMS]'}
              </button>
            )}

            {table === 'projects' && visibleItems.some(p => p.project_url) && (
              <div style={{ marginTop: '16px' }}>
                <div className="terminal__line" style={{ opacity: 0.6, marginBottom: '4px' }}>
                  {'LIVE LINKS:'}
                </div>
                {visibleItems.filter(p => p.project_url).map((p) => (
                  <div key={p.id} className="terminal__line">
                    {'  > ' + p.title + ': '}
                    <a
                      href={p.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--phosphor)',
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px',
                      }}
                    >
                      {p.project_url}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {modalItem && (
        <GalleryModal item={modalItem} onClose={() => setModalItem(null)} />
      )}
    </div>
  )
}
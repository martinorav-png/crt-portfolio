import { useState, useEffect } from 'react'
import { SECTIONS } from '../data/sections'
import { useTypewriter } from '../hooks/useTypewriter'
import { playKeystroke, stopTyping } from '../lib/sounds'
import { optimizeUrl } from '../lib/cloudinary'
import { fetchFeatured } from '../lib/supabase'

/**
 * Right panel — shows either:
 * - Showcase grid (homepage — featured project thumbnails)
 * - File preview with auto-loaded metadata
 * - Typed text content (for about, skills, contact sections)
 */
export default function PreviewPanel({ selection }) {
  if (!selection) {
    return (
      <div className="main__right">
        <div className="preview__header">
          <span className="preview__title">{'no_selection'}</span>
          <span className="preview__label">INFORMATION ANALYSIS</span>
        </div>
        <div className="preview__image-area">
          <div className="preview__placeholder">
            {'[ SELECT A FILE OR FOLDER ]'}
          </div>
        </div>
      </div>
    )
  }

  if (selection.type === 'showcase') {
    return <ShowcaseGrid />
  }

  if (selection.type === 'section') {
    return <TextPreview sectionKey={selection.key} />
  }

  return <FilePreview file={selection} />
}

/**
 * Homepage showcase — loads featured projects and displays
 * them as a visual grid immediately. No clicks needed.
 */
function ShowcaseGrid() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    async function load() {
      const data = await fetchFeatured()
      setItems(data)
      setLoading(false)
    }
    load()
  }, [])

  if (expanded) {
    return (
      <div className="main__right">
        <div className="preview__header">
          <span className="preview__title">{expanded.title}</span>
          <button
            className="preview__close-btn"
            onClick={() => setExpanded(null)}
          >
            {'[ BACK TO SHOWCASE ]'}
          </button>
        </div>
        <div className="preview__image-area">
          {expanded.image_url && (
            expanded.image_url.endsWith('.mp4') || expanded.image_url.endsWith('.webm') ? (
              <video
                src={expanded.image_url}
                controls
                autoPlay
                loop
                muted
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <div className="preview__image-protected">
                <img
                  src={optimizeUrl(expanded.image_url, 'full')}
                  alt={expanded.title}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <div className="preview__image-shield" />
              </div>
            )
          )}
        </div>
        <div className="preview__detail-bar">
          {expanded.description && (
            <span className="preview__detail-text">{expanded.description}</span>
          )}
          {expanded.project_url && (
            <a
              href={expanded.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="preview__live-link"
            >
              {'[ LIVE LINK ]'}
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="main__right">
      <div className="preview__header">
        <span className="preview__title">{'~/showcase'}</span>
        <span className="preview__label">FEATURED WORK</span>
      </div>

      <div className="showcase">
        {loading ? (
          <div className="showcase__loading">{'> Loading showcase...'}</div>
        ) : items.length === 0 ? (
          <div className="showcase__loading">{'> No featured items found.'}</div>
        ) : (
          <div className="showcase__grid">
            {items.map((item) => {
              const isVideo = item.image_url?.endsWith('.mp4') || item.image_url?.endsWith('.webm')
              return (
                <div
                  key={item.id}
                  className="showcase__card"
                  onClick={() => setExpanded(item)}
                >
                  <div className="showcase__card-image">
                    {isVideo ? (
                      <video
                        src={item.image_url}
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0 }}
                      />
                    ) : item.image_url ? (
                      <img
                        src={optimizeUrl(item.image_url, 'thumbnail')}
                        alt={item.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="showcase__card-empty">{'[ NO PREVIEW ]'}</div>
                    )}
                    <div className="showcase__card-scanline" />
                  </div>
                  <div className="showcase__card-info">
                    <span className="showcase__card-title">{item.title}</span>
                    {item.category_label && (
                      <span className="showcase__card-tag">{item.category_label}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="showcase__hint">
          {'> Browse folders on the left to explore all work'}
          <br />
          {'> Click any image above to expand'}
        </div>
      </div>
    </div>
  )
}

function TextPreview({ sectionKey }) {
  const section = SECTIONS[sectionKey]
  if (!section) return null

  const { displayed, done, skip } = useTypewriter(section.content, 8)

  useEffect(() => {
    if (displayed.length > 0 && !done) {
      playKeystroke()
    }
  }, [displayed, done])

  useEffect(() => {
    if (done) {
      stopTyping()
    }
  }, [done])

  useEffect(() => {
    return () => stopTyping()
  }, [])

  function handleSkip() {
    if (!done) {
      stopTyping()
      skip()
    }
  }

  return (
    <div className="main__right">
      <div className="preview__header">
        <span className="preview__title">{sectionKey + '.txt'}</span>
        <span className="preview__label">TEXT VIEWER</span>
      </div>
      <div className="preview__text-area" onClick={handleSkip}>
        {displayed.map((line, i) => (
          <div key={i} className="preview__text-line">{line}</div>
        ))}
        {done && (
          <div style={{ marginTop: '4px' }}>
            <span className="cursor" />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * File preview — metadata auto-loads immediately.
 * No more "Analyze Data" buttons.
 */
function FilePreview({ file }) {
  const item = file.data || {}
  const isVideo = item.image_url?.endsWith('.mp4') || item.image_url?.endsWith('.webm')
  const title = item.title || file.name

  const previewUrl = isVideo ? item.image_url : optimizeUrl(item.image_url, 'preview')

  return (
    <div className="main__right">
      <div className="preview__header">
        <span className="preview__title">{file.name}</span>
        <span className="preview__label">INFORMATION ANALYSIS</span>
      </div>

      <div className="preview__image-area">
        {item.image_url ? (
          isVideo ? (
            <video
              src={item.image_url}
              controls
              autoPlay
              loop
              muted
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <div className="preview__image-protected">
              <img
                src={previewUrl}
                alt={title}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="preview__image-shield" />
            </div>
          )
        ) : (
          <div className="preview__placeholder">{'[ NO PREVIEW AVAILABLE ]'}</div>
        )}
      </div>

      {/* Auto-loaded metadata — no buttons needed */}
      <div className="preview__meta-area">
        <div className="preview__meta-section">
          <div className="preview__meta-header">
            <span className="preview__meta-title">Meta Data</span>
            <span className="preview__meta-status">LOADED</span>
          </div>
          <div className="preview__meta-line">{'Title: ' + title}</div>
          {item.description && (
            <div className="preview__meta-line">{'Desc: ' + item.description}</div>
          )}
          {item.client && (
            <div className="preview__meta-line">{'Client: ' + item.client}</div>
          )}
          <div className="preview__meta-line">{'Type: ' + (isVideo ? 'Video' : 'Image')}</div>
        </div>

        <div className="preview__meta-section">
          <div className="preview__meta-header">
            <span className="preview__meta-title">Actions</span>
          </div>
          {item.image_url && (
            <button
              className="preview__action-btn"
              onClick={() => window.open(optimizeUrl(item.image_url, 'full'), '_blank')}
            >
              {'[ VIEW FULL SIZE ]'}
            </button>
          )}
          {item.project_url && (
            <button
              className="preview__action-btn"
              onClick={() => window.open(item.project_url, '_blank')}
            >
              {'[ OPEN LIVE SITE ]'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

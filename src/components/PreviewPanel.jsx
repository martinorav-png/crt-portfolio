import { useState } from 'react'
import { SECTIONS } from '../data/sections'
import { useTypewriter } from '../hooks/useTypewriter'
import { playSelect } from '../lib/sounds'

/**
 * Right panel — shows either:
 * - Image/video preview with metadata (for project files)
 * - Typed text content (for about, skills, contact sections)
 * - Empty placeholder (when nothing selected)
 */
export default function PreviewPanel({ selection }) {
  // No selection
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
        <EmptyMeta />
        <EmptyStats />
      </div>
    )
  }

  // Static text section (about, skills, contact)
  if (selection.type === 'section') {
    return <TextPreview sectionKey={selection.key} />
  }

  // File preview (image/video from Supabase)
  return <FilePreview file={selection} />
}

/**
 * Text content preview for static sections.
 */
function TextPreview({ sectionKey }) {
  const section = SECTIONS[sectionKey]
  if (!section) return null

  const { displayed, done, skip } = useTypewriter(section.content, 8)

  return (
    <div className="main__right">
      <div className="preview__header">
        <span className="preview__title">{sectionKey + '.txt'}</span>
        <span className="preview__label">TEXT VIEWER</span>
      </div>
      <div className="preview__text-area" onClick={!done ? skip : undefined}>
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
 * File preview with image, metadata, and analysis panels.
 */
function FilePreview({ file }) {
  const [metaLoaded, setMetaLoaded] = useState(false)
  const [analysisLoaded, setAnalysisLoaded] = useState(false)

  const item = file.data || {}
  const isVideo = item.image_url?.endsWith('.mp4') || item.image_url?.endsWith('.webm')
  const title = item.title || file.name

  function loadMeta() {
    playSelect()
    setMetaLoaded(true)
  }

  function loadAnalysis() {
    playSelect()
    setAnalysisLoaded(true)
  }

  return (
    <div className="main__right">
      {/* Header */}
      <div className="preview__header">
        <span className="preview__title">{file.name}</span>
        <span className="preview__label">INFORMATION ANALYSIS</span>
      </div>

      {/* Image/video area */}
      <div className="preview__image-area">
        {item.image_url ? (
          isVideo ? (
            <video src={item.image_url} controls autoPlay loop muted />
          ) : (
            <img src={item.image_url} alt={title} />
          )
        ) : (
          <div className="preview__placeholder">{'[ NO PREVIEW AVAILABLE ]'}</div>
        )}
      </div>

      {/* Meta + Analysis panels */}
      <div className="preview__meta-area">
        {/* Left: Meta Data */}
        <div className="preview__meta-section">
          <div className="preview__meta-header">
            <span className="preview__meta-title">Meta Data</span>
            {!metaLoaded ? (
              <button className="preview__meta-action" onClick={loadMeta}>
                Analyze Data
              </button>
            ) : (
              <button className="preview__meta-action" onClick={loadMeta}>
                Re-analyze Data
              </button>
            )}
          </div>
          {metaLoaded ? (
            <>
              <div className="preview__meta-line preview__meta-line--ok">
                Running Asset Meta Analysis...
              </div>
              <div className="preview__meta-line preview__meta-line--ok">
                Exposing Metrics...
              </div>
              <div className="preview__meta-line preview__meta-line--ok">
                Analysis Complete - dumping info:
              </div>
              <br />
              <div className="preview__meta-line">{'Title: ' + title}</div>
              {item.description && (
                <div className="preview__meta-line">{'Desc: ' + item.description}</div>
              )}
              {item.client && (
                <div className="preview__meta-line">{'Client: ' + item.client}</div>
              )}
              {item.category && (
                <div className="preview__meta-line">{'Category: ' + item.category}</div>
              )}
              <div className="preview__meta-line">{'Type: ' + (isVideo ? 'Video' : 'Image')}</div>
            </>
          ) : (
            <>
              <div className="preview__meta-line">{'[ metadata pending ]'}</div>
              <div className="preview__meta-line">{'[ click Analyze Data ]'}</div>
            </>
          )}
        </div>

        {/* Right: Historical Analysis */}
        <div className="preview__meta-section">
          <div className="preview__meta-header">
            <span className="preview__meta-title">Historical Analysis</span>
            {!analysisLoaded ? (
              <button className="preview__meta-action" onClick={loadAnalysis}>
                Analyze Asset
              </button>
            ) : (
              <span className="preview__meta-title" style={{ opacity: 0.4 }}>Complete</span>
            )}
          </div>
          {analysisLoaded ? (
            <>
              {item.description ? (
                <div className="preview__meta-line">{item.description}</div>
              ) : (
                <div className="preview__meta-line">
                  {'Asset catalogued in portfolio archive. No additional historical data available.'}
                </div>
              )}
              {item.project_url && (
                <>
                  <br />
                  <div className="preview__meta-line">{'Live deployment:'}</div>
                  <a
                    href={item.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--phosphor)',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                      fontSize: '12px',
                    }}
                  >
                    {item.project_url}
                  </a>
                </>
              )}
            </>
          ) : (
            <>
              <div className="preview__meta-line">{'[ analysis pending ]'}</div>
              <div className="preview__meta-line">{'[ click Analyze Asset ]'}</div>
            </>
          )}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="preview__stats-area">
        <span className="preview__stat">
          {'retrieved asset '}
          <span className="preview__stat-value">{item.image_url ? '1' : '0'}</span>
        </span>
        {item.image_url && (
          <button
            className="preview__stat-action"
            onClick={() => window.open(item.image_url, '_blank')}
          >
            {'[ display asset ]'}
          </button>
        )}
        {item.project_url && (
          <>
            <span className="preview__stat">
              {'live link '}
              <span className="preview__stat-value">1</span>
            </span>
            <button
              className="preview__stat-action"
              onClick={() => window.open(item.project_url, '_blank')}
            >
              {'[ open link ]'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function EmptyMeta() {
  return (
    <div className="preview__meta-area">
      <div className="preview__meta-section">
        <div className="preview__meta-header">
          <span className="preview__meta-title">Meta Data</span>
          <span className="preview__meta-title" style={{ opacity: 0.3 }}>Analyze Data</span>
        </div>
        <div className="preview__meta-line">{'[ no file selected ]'}</div>
      </div>
      <div className="preview__meta-section">
        <div className="preview__meta-header">
          <span className="preview__meta-title">Historical Analysis</span>
          <span className="preview__meta-title" style={{ opacity: 0.3 }}>Analyze Asset</span>
        </div>
        <div className="preview__meta-line">{'[ no file selected ]'}</div>
      </div>
    </div>
  )
}

function EmptyStats() {
  return (
    <div className="preview__stats-area">
      <span className="preview__stat">
        {'retrieved asset '}
        <span className="preview__stat-value">0</span>
      </span>
      <span className="preview__stat">
        {'media found '}
        <span className="preview__stat-value">0</span>
      </span>
    </div>
  )
}
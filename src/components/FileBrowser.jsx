import { useState, useEffect } from 'react'
import { fetchFeatured, fetchProjectsByCategory } from '../lib/supabase'
import { playSelect, playBack, playHover } from '../lib/sounds'

/**
 * Root-level entries. "featured/" loads the showcase.
 * Project categories are now directly at root — no nested projects/ folder.
 */
const ROOT_FOLDERS = [
  { name: 'featured/', type: 'folder', size: '--', date: '24 Mar 26 00:00', perms: 'drwxr-xr-x', source: 'featured' },
  { name: 'web_apps/', type: 'folder', size: '--', date: '24 Mar 26 00:00', perms: 'drwxr-xr-x', source: 'projects' },
  { name: 'selected_work/', type: 'folder', size: '--', date: '24 Mar 26 00:00', perms: 'drwxr-xr-x', source: 'selected' },
  { name: 'posters/', type: 'folder', size: '--', date: '24 Mar 26 00:00', perms: 'drwxr-xr-x', source: 'posters' },
  { name: 'game_dev/', type: 'folder', size: '--', date: '24 Mar 26 00:00', perms: 'drwxr-xr-x', source: 'game-wip' },
  { name: 'about/', type: 'folder-section', size: '--', date: '24 Mar 26 00:00', perms: 'drwxr-xr-x', section: 'about' },
  { name: 'skills/', type: 'folder-section', size: '--', date: '24 Mar 26 00:00', perms: 'drwxr-xr-x', section: 'skills' },
  { name: 'contact/', type: 'folder-section', size: '--', date: '24 Mar 26 00:00', perms: 'drwxr-xr-x', section: 'contact' },
]

function formatSize(bytes) {
  if (!bytes) return '--'
  const kb = Math.round(bytes / 1024)
  if (kb > 1024) return Math.round(kb / 1024) + ' MB'
  return kb + ' kb'
}

export default function FileBrowser({ onSelect, selectedId }) {
  const [path, setPath] = useState(null) // null = root, string = folder source
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentFolder, setCurrentFolder] = useState(null)

  // Auto-select showcase on initial load
  useEffect(() => {
    onSelect({ type: 'showcase' })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const currentPath = path === null
    ? 'ls -lah ~/'
    : 'ls -lah ~/' + (currentFolder || path) + '/'

  useEffect(() => {
    if (path === null) return

    async function loadFiles() {
      setLoading(true)
      const data = await fetchProjectsByCategory(path)

      const fileItems = data.map((item) => {
        const isVideo = item.image_url?.endsWith('.mp4') || item.image_url?.endsWith('.webm')
        const ext = isVideo ? '.mp4' : '.asset'
        return {
          name: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') + ext,
          type: 'file',
          size: formatSize(item.file_size || Math.floor(Math.random() * 50000) + 2000),
          date: '24 Mar 26 00:00',
          perms: '-rw-r--r--',
          data: item,
        }
      })

      setFiles(fileItems)
      setLoading(false)
    }

    loadFiles()
  }, [path])

  function handleRowClick(file) {
    if (file.type === 'folder-section') {
      playSelect()
      setPath(file.section)
      setCurrentFolder(file.name.replace('/', ''))
      onSelect({ type: 'section', key: file.section })
      return
    }

    if (file.type === 'folder') {
      playSelect()

      if (file.source === 'featured') {
        // Featured folder shows the showcase grid
        onSelect({ type: 'showcase' })
        setPath(null)
        return
      }

      setPath(file.source)
      setCurrentFolder(file.name.replace('/', ''))
      onSelect(null)
    } else {
      playSelect()
      onSelect({ type: 'file', ...file })
    }
  }

  function handleBack() {
    playBack()
    setPath(null)
    setCurrentFolder(null)
    onSelect({ type: 'showcase' })
  }

  const isRoot = path === null
  const displayFiles = isRoot ? ROOT_FOLDERS : files

  return (
    <div className="main__left">
      <div className="browser__header">
        <span className="browser__path">{currentPath}</span>
        <span className="browser__controls">{'Click to explore'}</span>
      </div>

      <div className="browser__columns">
        <span>PERMISSIONS</span>
        <span>SIZE</span>
        <span>DATE</span>
        <span>NAME</span>
      </div>

      <div className="browser__list">
        {!isRoot && (
          <div
            className="browser__back-btn"
            onClick={handleBack}
            onMouseEnter={playHover}
          >
            <span className="browser__back-icon">{'◄'}</span>
            <span className="browser__back-label">{'[ GO BACK ]'}</span>
            <span className="browser__back-path">{'../'}</span>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '12px', opacity: 0.5 }}>
            {'> Loading...'}
          </div>
        ) : (
          displayFiles.map((file, i) => {
            const isSelected = selectedId && file.data && file.data.id === selectedId
            const isFolder = file.type === 'folder' || file.type === 'folder-section'
            return (
              <div
                key={file.name + i}
                className={'browser__row' + (isSelected ? ' browser__row--selected' : '') + (isFolder ? ' browser__row--folder' : '')}
                onClick={() => handleRowClick(file)}
                onMouseEnter={playHover}
              >
                <span className="browser__perms">{file.perms}</span>
                <span className="browser__size">{file.size}</span>
                <span className="browser__date">{file.date}</span>
                <span className="browser__name">
                  {file.name}
                  {isSelected && <span className="browser__ok-tag">{'[ OK ]'}</span>}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { fetchProjects, fetchWorksByCategory } from '../lib/supabase'
import { playSelect, playBack, playHover } from '../lib/sounds'

const ROOT_FOLDERS = [
  { name: 'about/', type: 'folder', size: '--', date: '08 Feb 26 00:00', perms: 'drwxr-xr-x' },
  { name: 'projects/', type: 'folder', size: '--', date: '08 Feb 26 00:00', perms: 'drwxr-xr-x' },
  { name: 'skills/', type: 'folder', size: '--', date: '08 Feb 26 00:00', perms: 'drwxr-xr-x' },
  { name: 'contact/', type: 'folder', size: '--', date: '08 Feb 26 00:00', perms: 'drwxr-xr-x' },
]

const PROJECT_FOLDERS = [
  { name: 'web_apps/', type: 'folder', size: '--', date: '08 Feb 26 00:00', perms: 'drwxr-xr-x', source: 'projects' },
  { name: 'client_work/', type: 'folder', size: '--', date: '08 Feb 26 00:00', perms: 'drwxr-xr-x', source: 'catwees' },
  { name: 'artist_posters/', type: 'folder', size: '--', date: '08 Feb 26 00:00', perms: 'drwxr-xr-x', source: 'artist-posters' },
  { name: 'game_posters/', type: 'folder', size: '--', date: '08 Feb 26 00:00', perms: 'drwxr-xr-x', source: 'game-posters' },
]

function formatSize(bytes) {
  if (!bytes) return '--'
  const kb = Math.round(bytes / 1024)
  if (kb > 1024) return Math.round(kb / 1024) + ' MB'
  return kb + ' kb'
}

export default function FileBrowser({ onSelect, selectedId }) {
  const [path, setPath] = useState([])
  const [files, setFiles] = useState(ROOT_FOLDERS)
  const [loading, setLoading] = useState(false)

  const currentPath = 'ls -lah ' + (path.length === 0 ? '~/' : '~/' + path.join('/') + '/')

  useEffect(() => {
    async function loadFiles() {
      if (path.length === 0) {
        setFiles(ROOT_FOLDERS)
        return
      }

      if (path[0] === 'projects' && path.length === 1) {
        setFiles(PROJECT_FOLDERS)
        return
      }

      if (path[0] === 'projects' && path.length === 2) {
        const folder = PROJECT_FOLDERS.find(f => f.name === path[1] + '/')
        if (!folder) return

        setLoading(true)
        let data = []

        if (folder.source === 'projects') {
          data = await fetchProjects()
        } else {
          data = await fetchWorksByCategory(folder.source)
        }

        const fileItems = data.map((item) => {
          const isVideo = item.image_url?.endsWith('.mp4') || item.image_url?.endsWith('.webm')
          const ext = isVideo ? '.mp4' : '.asset'
          return {
            name: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') + ext,
            type: 'file',
            size: formatSize(Math.floor(Math.random() * 50000) + 2000),
            date: '08 Feb 26 00:00',
            perms: '-rw-r--r--',
            data: item,
          }
        })

        setFiles(fileItems)
        setLoading(false)
        return
      }

      if (['about', 'skills', 'contact'].includes(path[0]) && path.length === 1) {
        onSelect({ type: 'section', key: path[0] })
        setFiles([])
        return
      }
    }

    loadFiles()
  }, [path])

  function handleRowClick(file) {
    if (file.type === 'folder') {
      playSelect()
      const folderName = file.name.replace('/', '')

      if (path.length === 0 && ['about', 'skills', 'contact'].includes(folderName)) {
        setPath([folderName])
        onSelect({ type: 'section', key: folderName })
        return
      }

      setPath([...path, folderName])
      onSelect(null)
    } else {
      playSelect()
      onSelect({ type: 'file', ...file })
    }
  }

  function handleBack() {
    playBack()
    const newPath = path.slice(0, -1)
    setPath(newPath)
    onSelect(null)
  }

  return (
    <div className="main__left">
      <div className="browser__header">
        <span className="browser__path">{currentPath}</span>
        <span className="browser__controls">{'↑ ↓ • Enter • Click'}</span>
      </div>

      <div className="browser__columns">
        <span>PERMISSIONS</span>
        <span>SIZE</span>
        <span>DATE</span>
        <span>NAME</span>
      </div>

      <div className="browser__list">
        {/* Back button — bright and obvious */}
        {path.length > 0 && (
          <div
            className="browser__back-btn"
            onClick={handleBack}
            onMouseEnter={playHover}
          >
            <span className="browser__back-icon">{'◄'}</span>
            <span className="browser__back-label">{'[ GO BACK ]'}</span>
            <span className="browser__back-path">{'../' + (path.length > 1 ? path.slice(0, -1).join('/') + '/' : '')}</span>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '12px', opacity: 0.5 }}>
            {'> Loading...'}
          </div>
        ) : files.length === 0 && !['about', 'skills', 'contact'].includes(path[0]) ? (
          <div style={{ padding: '12px', opacity: 0.5 }}>
            {'> Empty directory'}
          </div>
        ) : (
          files.map((file, i) => {
            const isSelected = selectedId && file.data && file.data.id === selectedId
            return (
              <div
                key={file.name + i}
                className={'browser__row' + (isSelected ? ' browser__row--selected' : '') + (file.type === 'folder' ? ' browser__row--folder' : '')}
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
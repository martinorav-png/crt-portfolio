import { useState, useCallback } from 'react'
import CRTOverlay from './CRTOverlay'
import BootScreen from './BootScreen'
import Header from './Header'
import FileBrowser from './FileBrowser'
import PreviewPanel from './PreviewPanel'
import StatusBar from './StatusBar'

/**
 * Main terminal shell — split panel layout.
 * Boot sequence → full screen terminal OS with file browser + preview.
 */
export default function Terminal() {
  const [booted, setBooted] = useState(false)
  const [selection, setSelection] = useState(null)

  const handleSelect = useCallback((item) => {
    setSelection(item)
  }, [])

  return (
    <>
      <CRTOverlay />

      {!booted && (
        <BootScreen onComplete={() => setBooted(true)} />
      )}

      {booted && (
        <div className="shell">
          <Header />
          <div className="main">
            <FileBrowser
              onSelect={handleSelect}
              selectedId={selection?.data?.id}
            />
            <PreviewPanel selection={selection} />
          </div>
          <StatusBar />
        </div>
      )}
    </>
  )
}
import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook that types out an array of strings line-by-line.
 * Returns { displayed, done, skip }
 */
export function useTypewriter(lines, speed = 18, enabled = true) {
  const [displayed, setDisplayed] = useState([])
  const [done, setDone] = useState(false)
  const skipRef = useRef(false)

  useEffect(() => {
    if (!enabled || !lines || lines.length === 0) {
      setDisplayed(lines || [])
      setDone(true)
      return
    }

    setDisplayed([])
    setDone(false)
    skipRef.current = false

    let lineIdx = 0
    let charIdx = 0
    let current = []
    let cancelled = false

    function tick() {
      if (cancelled) return

      if (skipRef.current) {
        setDisplayed([...lines])
        setDone(true)
        return
      }

      if (lineIdx >= lines.length) {
        setDone(true)
        return
      }

      const line = lines[lineIdx]

      if (charIdx <= line.length) {
        current[lineIdx] = line.slice(0, charIdx)
        setDisplayed([...current])
        charIdx++
        setTimeout(tick, line === '' ? 40 : speed)
      } else {
        lineIdx++
        charIdx = 0
        setTimeout(tick, 60)
      }
    }

    tick()
    return () => { cancelled = true }
  }, [lines, speed, enabled])

  const skip = useCallback(() => {
    skipRef.current = true
    if (lines) {
      setDisplayed([...lines])
      setDone(true)
    }
  }, [lines])

  return { displayed, done, skip }
}
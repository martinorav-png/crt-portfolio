import { useState, useEffect } from 'react'

const TIPS = [
  'Have a coffee break every hour • keep stress reasonable',
  'Good design fades into the background • not demands attention',
  'Empathy first • pixels second',
  'Outer Wilds taught me: curiosity is the best mechanic',
  'Ctrl+S early • Ctrl+S often',
  'When in doubt • prototype it out',
  'The best interface is the one you don\'t notice',
  'Take a walk • your subconscious will solve it',
  'Ship it • then iterate',
  'Play more games • they\'re research now',
]

/**
 * Bottom status bar with rotating tips and build info.
 */
export default function StatusBar() {
  const [tipIndex, setTipIndex] = useState(
    Math.floor(Math.random() * TIPS.length)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="statusbar">
      <span className="statusbar__tip">{'tip: ' + TIPS[tipIndex]}</span>
      <span className="statusbar__build">{'build: 0xC0FFEE • theme: crt-green'}</span>
    </div>
  )
}
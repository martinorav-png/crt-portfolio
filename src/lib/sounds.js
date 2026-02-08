/**
 * CRT Terminal Sound Effects
 * Uses real audio files for authentic sounds.
 * Files expected in /public/sounds/
 *
 * - select.mp3     → Hacking pass good (menu click / enter)
 * - back.mp3       → Hacking pass bad (back button)
 * - typing.mp3     → Digital typing loop (typewriter effect)
 * - boot.mp3       → Hard drive startup (plays on boot)
 * - hum-loop.mp3   → Hard drive idle hum (loops after boot)
 */

// ── Preloaded audio elements ──────────────────────────────────

const selectSound = new Audio('/sounds/select.mp3')
const backSound = new Audio('/sounds/back.mp3')
const typingSound = new Audio('/sounds/typing.mp3')
const bootSound = new Audio('/sounds/boot.mp3')
const humLoop = new Audio('/sounds/hum-loop.mp3')

// Set volumes
selectSound.volume = 0.35
backSound.volume = 0.35
typingSound.volume = 0.12
bootSound.volume = 0.25
humLoop.volume = 0.08

// Hum loops forever
humLoop.loop = true

// Preload all
selectSound.preload = 'auto'
backSound.preload = 'auto'
typingSound.preload = 'auto'
bootSound.preload = 'auto'
humLoop.preload = 'auto'

// ── Boot sound state ──────────────────────────────────────────
// Browsers block autoplay until user clicks. We set up a
// one-time listener that plays the boot sound on first interaction.

let bootStarted = false

function startBootOnInteraction() {
  if (bootStarted) return
  bootStarted = true

  bootSound.currentTime = 0
  bootSound.play().catch(() => {})

  // Start hum loop when boot nears the end
  bootSound.addEventListener('ended', () => {
    humLoop.currentTime = 0
    humLoop.play().catch(() => {})
  })

  // Remove all listeners
  document.removeEventListener('click', startBootOnInteraction)
  document.removeEventListener('keydown', startBootOnInteraction)
  document.removeEventListener('touchstart', startBootOnInteraction)
}

/**
 * Call this once on mount. Sets up listeners that will play
 * the boot sound on the user's first interaction.
 */
export function initBootSound() {
  document.addEventListener('click', startBootOnInteraction, { once: false })
  document.addEventListener('keydown', startBootOnInteraction, { once: false })
  document.addEventListener('touchstart', startBootOnInteraction, { once: false })
}

// ── Hover sound (kept as Web Audio — too short for a file) ────

let audioCtx = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

export function playHover() {
  const ctx = getCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.type = 'sine'
  osc.frequency.setValueAtTime(600, ctx.currentTime)

  gain.gain.setValueAtTime(0.012, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.05)
}

// ── Menu select (hacking pass good) ──────────────────────────

export function playSelect() {
  selectSound.currentTime = 0
  selectSound.play().catch(() => {})
}

// ── Back button (hacking pass bad) ───────────────────────────

export function playBack() {
  backSound.currentTime = 0
  backSound.play().catch(() => {})
}

// ── Typing sound ─────────────────────────────────────────────

let typingPlaying = false

export function playKeystroke() {
  if (!typingPlaying) {
    typingSound.currentTime = 0
    typingSound.loop = true
    typingSound.play().catch(() => {})
    typingPlaying = true
  }
}

export function stopTyping() {
  if (typingPlaying) {
    typingSound.pause()
    typingSound.currentTime = 0
    typingPlaying = false
  }
}

// ── Deprecated — kept for backwards compat ───────────────────

export function playBoot() {
  // Boot is now handled by initBootSound + user interaction
  // This is a no-op to avoid breaking existing imports
}
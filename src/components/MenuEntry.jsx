import { playHover, playSelect } from '../lib/sounds'

/**
 * A single clickable terminal menu entry.
 * Inverts colors on hover like Fallout terminals.
 */
export default function MenuEntry({ label, desc, onClick }) {
  return (
    <button
      className="menu-entry"
      onMouseEnter={playHover}
      onClick={() => {
        playSelect()
        onClick()
      }}
    >
      <span>{label}</span>
      {desc && <span className="menu-entry__desc">{desc}</span>}
    </button>
  )
}
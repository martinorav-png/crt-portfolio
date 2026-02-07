/**
 * CRT visual effects overlay.
 * Renders scanlines, vignette, rolling line, and screen reflection.
 */
export default function CRTOverlay() {
  return (
    <>
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
      <div className="crt-roll-line" />
      <div className="crt-reflection" />
    </>
  )
}
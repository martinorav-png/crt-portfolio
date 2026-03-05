import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTypewriter } from '../hooks/useTypewriter'
import { initBootSound, playKeystroke, stopTyping } from '../lib/sounds'

const BOOT_LINES = [
  '[ OK ] ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL',
  '[ OK ] COPYRIGHT 2077 ROBCO INDUSTRIES',
  '',
  '[ OK ] User System Check',
  '[ OK ] Initializing portfolio kernel...',
  '[ OK ] Mounting /projects',
  '[ OK ] Loading thumbnails...',
  '[ OK ] Establishing uplink...',
  '',
  'MARTIN ORAV — PERSONAL TERMINAL v2.6.0',
  '',
  '> CONNECTION ESTABLISHED.',
  '> ACCESS: GRANTED',
  '',
]

function ShaderBackground() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.002;

        float intensity = 0.0;
        for (int i = 0; i < 5; i++) {
          intensity += lineWidth * float(i * i) /
            abs(fract(t + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
        }

        // Phosphor green palette
        vec3 color = vec3(
          intensity * 0.12,
          intensity * 1.0,
          intensity * 0.25
        );

        gl_FragColor = vec4(color, 1.0);
      }
    `

    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    onResize()
    window.addEventListener('resize', onResize)

    const animate = () => {
      const id = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      renderer.render(scene, camera)
      if (sceneRef.current) sceneRef.current.animationId = id
    }

    sceneRef.current = { camera, scene, renderer, uniforms, animationId: 0 }
    animate()

    return () => {
      window.removeEventListener('resize', onResize)
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }
        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        background: '#000',
        overflow: 'hidden',
        opacity: 0.4,
      }}
    />
  )
}

export default function BootScreen({ onComplete }) {
  const { displayed, done, skip } = useTypewriter(BOOT_LINES, 20)

  useEffect(() => {
    initBootSound()
  }, [])

  useEffect(() => {
    if (displayed.length > 0 && !done) {
      playKeystroke()
    }
  }, [displayed])

  useEffect(() => {
    if (done) {
      stopTyping()
      const t = setTimeout(onComplete, 800)
      return () => clearTimeout(t)
    }
  }, [done, onComplete])

  function handleSkip() {
    stopTyping()
    if (done) {
      onComplete()
    } else {
      skip()
    }
  }

  return (
    <div className="boot-overlay" onClick={handleSkip}>
      <ShaderBackground />
      <div className="boot-content" style={{ position: 'relative', zIndex: 1 }}>
        {displayed.map((line, i) => (
          <div key={i} className="terminal__line">{line}</div>
        ))}
        {!done && <span className="cursor" />}
        {done && (
          <div style={{ marginTop: '12px', opacity: 0.5 }}>
            {'> Click anywhere to continue...'}
          </div>
        )}
      </div>
    </div>
  )
}
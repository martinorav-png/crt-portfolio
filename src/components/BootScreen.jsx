import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useTypewriter } from '../hooks/useTypewriter'
import { initBootSound, playKeystroke, stopTyping } from '../lib/sounds'

const BOOT_LINES = [
  '[ OK ] System Check',
  '[ OK ] Initializing portfolio kernel...',
  '[ OK ] Mounting /projects',
  '[ OK ] Loading showcase...',
  '',
  'MARTIN ORAV — PERSONAL TERMINAL v3.0',
  '',
  '> CONNECTION ESTABLISHED.',
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
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      vec2 crtCurve(vec2 uv) {
        uv = uv * 2.0 - 1.0;
        vec2 offset = abs(uv.yx) / vec2(6.0, 4.0);
        uv = uv + uv * offset * offset;
        uv = uv * 0.5 + 0.5;
        return uv;
      }

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main(void) {
        vec2 rawUv = gl_FragCoord.xy / resolution.xy;
        vec2 uv = crtCurve(rawUv);

        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
          return;
        }

        float t = time * 0.05;
        float intensity = 0.0;
        vec2 centeredUv = (uv * 2.0 - 1.0);
        for (int i = 0; i < 5; i++) {
          intensity += 0.002 * float(i * i) /
            abs(fract(t + float(i) * 0.01) * 5.0 - length(centeredUv) + mod(uv.y, 0.2));
        }

        float scanline = sin(uv.y * resolution.y * 1.5) * 0.5 + 0.5;
        scanline = pow(scanline, 1.5) * 0.3 + 0.7;

        float phosphorRow = sin(uv.y * resolution.y * 0.5) * 0.5 + 0.5;
        phosphorRow = pow(phosphorRow, 2.0) * 0.15 + 0.85;

        float subPixel = mod(gl_FragCoord.x, 3.0);
        vec3 subPixelMask = vec3(
          step(0.5, 1.0 - abs(subPixel - 0.0)),
          step(0.5, 1.0 - abs(subPixel - 1.0)),
          step(0.5, 1.0 - abs(subPixel - 2.0))
        );
        subPixelMask = subPixelMask * 0.4 + 0.6;

        float rollPos = fract(time * 0.02);
        float roll = smoothstep(0.0, 0.02, abs(uv.y - rollPos)) *
                     smoothstep(0.0, 0.02, abs(uv.y - rollPos - 1.0));
        roll = roll * 0.15 + 0.85;

        float noise = random(uv + fract(time * 0.1)) * 0.04;

        vec2 vigUv = uv * (1.0 - uv.yx);
        float vignette = vigUv.x * vigUv.y * 15.0;
        vignette = pow(vignette, 0.25);

        vec3 color = vec3(
          intensity * 0.12,
          intensity * 1.0,
          intensity * 0.25
        );

        color *= scanline;
        color *= phosphorRow;
        color *= roll;
        color *= subPixelMask;
        color *= vignette;
        color += noise * vec3(0.05, 0.15, 0.07);

        float glow = intensity * 0.15;
        color += vec3(glow * 0.1, glow * 0.4, glow * 0.15);

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
        opacity: 0.5,
      }}
    />
  )
}

export default function BootScreen({ onComplete }) {
  // Skip boot if already seen this session
  const [shouldSkip] = useState(() => {
    if (sessionStorage.getItem('crt-booted')) return true
    sessionStorage.setItem('crt-booted', '1')
    return false
  })

  const { displayed, done, skip } = useTypewriter(
    shouldSkip ? [] : BOOT_LINES,
    14
  )

  useEffect(() => {
    if (shouldSkip) {
      onComplete()
      return
    }
    initBootSound()
  }, [shouldSkip, onComplete])

  useEffect(() => {
    if (displayed.length > 0 && !done) {
      playKeystroke()
    }
  }, [displayed, done])

  useEffect(() => {
    if (done && !shouldSkip) {
      stopTyping()
      const t = setTimeout(onComplete, 400)
      return () => clearTimeout(t)
    }
  }, [done, onComplete, shouldSkip])

  function handleSkip() {
    stopTyping()
    if (done) {
      onComplete()
    } else {
      skip()
    }
  }

  if (shouldSkip) return null

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

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { onWaterDrop } from './waterBus'
import './WaterCanvas.css'
import '../Ripples.css'

// One sim texel per N css pixels. The wave field doesn't need display
// resolution — coarser grid also makes waves travel faster per frame.
const SIM_SCALE = 3
const MAX_SIM_SIZE = 768
const MAX_DROPS_PER_FRAME = 16

const QUAD_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// Classic 2D wave equation on a ping-pong buffer.
// r = height, g = vertical velocity. Clamped sampling at the borders acts
// as a soft wall, so disturbances visibly reflect off the screen edges.
const SIM_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uPrev;
  uniform vec2 uTexel;
  uniform float uAspect;
  uniform int uDropCount;
  uniform vec4 uDrops[${MAX_DROPS_PER_FRAME}]; // xy: uv, z: strength, w: radius (v units)

  void main() {
    vec2 data = texture2D(uPrev, vUv).rg;
    float l = texture2D(uPrev, vec2(vUv.x - uTexel.x, vUv.y)).r;
    float r = texture2D(uPrev, vec2(vUv.x + uTexel.x, vUv.y)).r;
    float t = texture2D(uPrev, vec2(vUv.x, vUv.y + uTexel.y)).r;
    float b = texture2D(uPrev, vec2(vUv.x, vUv.y - uTexel.y)).r;

    float average = (l + r + t + b) * 0.25;
    float velocity = data.g + (average - data.r) * 1.94;
    velocity *= 0.9915;
    float height = (data.r + velocity) * 0.9992;

    for (int i = 0; i < ${MAX_DROPS_PER_FRAME}; i++) {
      if (i >= uDropCount) break;
      vec4 d = uDrops[i];
      float dist = length((vUv - d.xy) * vec2(uAspect, 1.0));
      if (dist < d.w) {
        height += d.z * 0.5 * (1.0 + cos(dist / d.w * 3.14159265));
      }
    }

    gl_FragColor = vec4(clamp(height, -2.0, 2.0), velocity, 0.0, 1.0);
  }
`

// Calm flat pond: soft drifting tonal patches (lighter sunlit water and
// darker depth) over a flat base, with hand-drawn ripple rings on top.
// The wave sim gently refracts the surface so splashes have life.
const DISPLAY_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uSim;
  uniform vec2 uSimTexel;
  uniform float uAmp;
  uniform float uTime;
  uniform float uAspect;
  uniform float uLineFade;  // 0..1 intro reveal
  uniform float uScroll;    // zone scroll, in viewport-height units
  uniform float uZoneH;     // page-ripple-zone height, in viewport-height units
  uniform int uRippleCount;
  uniform vec4 uRipples[20];   // xy: center uv, z: age 0..1, w: radius (v units)
  uniform float uRippleAmp[20]; // per-ring intensity (ambient < interactive)
  uniform vec3 uBase;
  uniform vec3 uLight;
  uniform vec3 uDepth;
  uniform vec3 uEdge;
  uniform vec3 uCaustic;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = p * 2.03 + 11.3;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vec2(vUv.x * uAspect, vUv.y);

    // the cursor disturbs the water: the wave sim is fed only by cursor
    // movement, and its height gradient shoves the floating patches around,
    // then settles back to calm once the cursor stops
    float hl = texture2D(uSim, vec2(vUv.x - uSimTexel.x, vUv.y)).r;
    float hr = texture2D(uSim, vec2(vUv.x + uSimTexel.x, vUv.y)).r;
    float hb = texture2D(uSim, vec2(vUv.x, vUv.y - uSimTexel.y)).r;
    float ht = texture2D(uSim, vec2(vUv.x, vUv.y + uSimTexel.y)).r;
    vec2 disturb = vec2((hr - hl) * uAspect, -(ht - hb)) * uAmp * 4.0;

    vec3 col = uBase;

    // Zone-space vertical coordinate: the canvas stays fixed to the
    // viewport, but the pond is mapped onto the whole .page-ripple-zone,
    // so scrolling reveals different water and the bottom edge lands at
    // the zone end (just above the contact section).
    float zy = uScroll + (1.0 - vUv.y);          // height units from zone top
    vec2 pz = vec2((vUv.x - 0.5) * uAspect, zy);

    // Flat cartoon-pond shapes: each tone is a solid fill with a crisp
    // boundary (edge only as wide as one pixel via fwidth — no gradients).
    // A gentle domain warp gives the patches irregular, organic outlines
    // instead of round blobs; several layers keep the tall pond dappled.
    float t = uTime * 0.012;
    vec2 wp = pz + disturb + (vec2(fbm(pz * 1.3 + 50.0), fbm(pz * 1.3 + 90.0)) - 0.5) * 0.35;

    // big light sunlit patches
    float fLight = fbm(wp * 1.05 + vec2(t, -t * 0.7) + 4.0);
    float la = fwidth(fLight);
    col = mix(col, uLight, smoothstep(0.55 - la, 0.55 + la, fLight) * uLineFade);

    // distinct mid-blue depth patches — the main source of visible
    // dappling against the lighter interior
    float fDepth = fbm(wp * 1.25 + vec2(-t * 0.8, t * 0.5) + 21.0);
    float da = fwidth(fDepth);
    col = mix(col, uDepth, smoothstep(0.53 - da, 0.53 + da, fDepth) * uLineFade);

    // a scattering of small bright glints for dappled, natural variety
    float fGlint = fbm(wp * 2.3 + vec2(-t * 0.5, t * 0.6) + 70.0);
    float ga = fwidth(fGlint);
    col = mix(col, uLight, smoothstep(0.66 - ga, 0.66 + ga, fGlint) * uLineFade);

    // Darker water only along the bottom shoreline (just above the contact
    // section) — the sides and top stay open water. Distance up from the
    // zone bottom, pushed by low-frequency noise so the shore meanders, with
    // the two dark layers given independent noise-varied widths.
    float ed = (uZoneH - zy)
             + (fbm(pz * 0.55 + 9.0) - 0.5) * 0.15
             + (fbm(pz * 1.7 + 4.0) - 0.5) * 0.05;
    float ea = fwidth(ed);
    float depthW = 0.13 + (fbm(pz * 0.70 + 30.0) - 0.5) * 0.09;
    float edgeW  = 0.05 + (fbm(pz * 0.95 + 61.0) - 0.5) * 0.055;
    col = mix(col, uDepth, (1.0 - smoothstep(depthW - ea, depthW + ea, ed)) * uLineFade);
    col = mix(col, uEdge,  (1.0 - smoothstep(edgeW - ea, edgeW + ea, ed)) * uLineFade);

    // hand-drawn ripple rings expanding from clicks, splashes, and the
    // faint ambient pond ripples — wobbled so the circles feel drawn
    for (int i = 0; i < 20; i++) {
      if (i >= uRippleCount) break;
      vec4 rp = uRipples[i];
      vec2 d = p - vec2(rp.x * uAspect, rp.y);
      float ease = 1.0 - pow(1.0 - rp.z, 3.0);
      float r = rp.w * ease;
      float wob = (noise(p * 9.0 + rp.xy * 53.0) - 0.5) * 0.014;
      float ringDist = abs(length(d) - r + wob);
      float aa = max(fwidth(ringDist), 1e-4) * 1.2;
      float ring = 1.0 - smoothstep(aa, aa * 2.6, ringDist);
      col = mix(col, uCaustic, ring * pow(1.0 - rp.z, 1.5) * 0.85 * uRippleAmp[i] * uLineFade);
    }

    gl_FragColor = vec4(col, 1.0);
  }
`

// Raw sRGB values — the shader writes straight to the canvas, so skip
// three's sRGB→linear conversion or the pond won't match the page bg.
const srgb = (hex) =>
  new THREE.Vector3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255)

const COLORS = {
  base:    srgb(0xCFDBE5),
  light:   srgb(0xE6EEF5),
  depth:   srgb(0xACC4D8),
  edge:    srgb(0x91B0CA),
  caustic: srgb(0xFAFDFE),
}

function createWater(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  })
  if (!renderer.capabilities.isWebGL2) {
    renderer.dispose()
    return null
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const scene = new THREE.Scene()

  const simMaterial = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERTEX,
    fragmentShader: SIM_FRAGMENT,
    uniforms: {
      uPrev: { value: null },
      uTexel: { value: new THREE.Vector2() },
      uAspect: { value: 1 },
      uDropCount: { value: 0 },
      uDrops: { value: Array.from({ length: MAX_DROPS_PER_FRAME }, () => new THREE.Vector4()) },
    },
  })

  const displayMaterial = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERTEX,
    fragmentShader: DISPLAY_FRAGMENT,
    uniforms: {
      uSim: { value: null },
      uSimTexel: { value: new THREE.Vector2() },
      uAmp: { value: 0 },
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uLineFade: { value: 0 },
      uScroll: { value: 0 },
      uZoneH: { value: 3 },
      uRippleCount: { value: 0 },
      uRipples: { value: Array.from({ length: 20 }, () => new THREE.Vector4()) },
      uRippleAmp: { value: new Float32Array(20) },
      uBase: { value: COLORS.base },
      uLight: { value: COLORS.light },
      uDepth: { value: COLORS.depth },
      uEdge: { value: COLORS.edge },
      uCaustic: { value: COLORS.caustic },
    },
  })

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial)
  quad.frustumCulled = false
  scene.add(quad)

  let targets = []
  let current = 0
  let width = 0
  let height = 0

  const makeTarget = (w, h) =>
    new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    })

  const resize = () => {
    width = window.innerWidth
    height = window.innerHeight
    renderer.setSize(width, height)

    let simW = Math.round(width / SIM_SCALE)
    let simH = Math.round(height / SIM_SCALE)
    const scale = Math.min(1, MAX_SIM_SIZE / Math.max(simW, simH))
    simW = Math.max(64, Math.round(simW * scale))
    simH = Math.max(64, Math.round(simH * scale))

    targets.forEach((t) => t.dispose())
    targets = [makeTarget(simW, simH), makeTarget(simW, simH)]
    targets.forEach((t) => {
      renderer.setRenderTarget(t)
      renderer.setClearColor(0x000000, 1)
      renderer.clear(true, false, false)
    })
    renderer.setRenderTarget(null)

    simMaterial.uniforms.uTexel.value.set(1 / simW, 1 / simH)
    simMaterial.uniforms.uAspect.value = width / height
    displayMaterial.uniforms.uAspect.value = width / height
    displayMaterial.uniforms.uSimTexel.value.set(1 / simW, 1 / simH)
  }
  resize()

  const pending = []
  const addDrop = (x, y, strength, radius) => {
    pending.push({
      u: x / width,
      v: 1 - y / height,
      strength,
      radius: radius / height,
    })
  }

  const clock = new THREE.Clock()

  // Expanding hand-drawn rings; birth can sit in the future for the
  // staggered multi-ring choreography. Per-ring life lets the cursor
  // trail pop quickly while splashes/ambient linger.
  const RIPPLE_LIFE = 2.1
  const ripples = []
  const addRing = (x, y, radiusPx, delay = 0, amp = 1, life = RIPPLE_LIFE) => {
    if (ripples.length >= 32) ripples.shift()
    ripples.push({
      u: x / width,
      v: 1 - y / height,
      birth: clock.getElapsedTime() + delay,
      radius: radiusPx / height,
      amp,
      life,
    })
  }

  const step = () => {
    const count = Math.min(pending.length, MAX_DROPS_PER_FRAME)
    for (let i = 0; i < count; i++) {
      const d = pending.shift()
      simMaterial.uniforms.uDrops.value[i].set(d.u, d.v, d.strength, d.radius)
    }
    // Two substeps per frame so waves travel at a lively speed; drops are
    // only injected on the first.
    for (let s = 0; s < 2; s++) {
      simMaterial.uniforms.uDropCount.value = s === 0 ? count : 0
      simMaterial.uniforms.uPrev.value = targets[current].texture
      quad.material = simMaterial
      renderer.setRenderTarget(targets[1 - current])
      renderer.render(scene, camera)
      current = 1 - current
    }

    const now = clock.getElapsedTime()
    displayMaterial.uniforms.uTime.value = now

    for (let i = ripples.length - 1; i >= 0; i--) {
      if (now - ripples[i].birth > ripples[i].life) ripples.splice(i, 1)
    }
    // pack newest-first so the ring at the cursor always renders immediately
    // (older rings drop off the end instead of holding back fresh ones)
    let ringCount = 0
    const ampArr = displayMaterial.uniforms.uRippleAmp.value
    for (let i = ripples.length - 1; i >= 0 && ringCount < 20; i--) {
      const rp = ripples[i]
      if (rp.birth > now) continue
      displayMaterial.uniforms.uRipples.value[ringCount].set(
        rp.u, rp.v, (now - rp.birth) / rp.life, rp.radius
      )
      ampArr[ringCount] = rp.amp
      ringCount++
    }
    displayMaterial.uniforms.uRippleCount.value = ringCount

    displayMaterial.uniforms.uSim.value = targets[current].texture
    quad.material = displayMaterial
    renderer.setRenderTarget(null)
    renderer.render(scene, camera)
  }

  // scroll + zone height, both in viewport-height units, so the pond maps
  // onto the full .page-ripple-zone while the canvas stays viewport-fixed
  const setView = (scroll, zoneHeight) => {
    displayMaterial.uniforms.uScroll.value = scroll
    displayMaterial.uniforms.uZoneH.value = zoneHeight
  }

  const dispose = () => {
    targets.forEach((t) => t.dispose())
    quad.geometry.dispose()
    simMaterial.dispose()
    displayMaterial.dispose()
    renderer.dispose()
  }

  return { renderer, displayMaterial, addDrop, addRing, setView, step, resize, dispose }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

// DOM-ring fallback for browsers without WebGL2 — reuses the original
// ripple visuals so interactions still respond.
function DomRipplesFallback() {
  const layerRef = useRef(null)

  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return

    const spawn = (x, y, sizes) => {
      sizes.forEach((size, i) => {
        setTimeout(() => {
          if (!layer.isConnected) return
          const ring = document.createElement('div')
          ring.className = 'ripple-ring'
          ring.style.left = `${x - size / 2}px`
          ring.style.top = `${y - size / 2}px`
          ring.style.width = `${size}px`
          ring.style.height = `${size}px`
          layer.appendChild(ring)
          ring.addEventListener('animationend', () => ring.remove())
        }, i * 150)
      })
    }

    let lastMove = 0
    const onMove = (e) => {
      const now = Date.now()
      if (now - lastMove < 300) return
      lastMove = now
      spawn(e.clientX, e.clientY, [120, 240, 360])
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    const offDrop = onWaterDrop(({ x, y, strength }) => {
      const base = 120 + Math.abs(strength) * 260
      spawn(x, y, [base, base * 1.6, base * 2.2])
    })
    return () => {
      window.removeEventListener('mousemove', onMove)
      offDrop()
    }
  }, [])

  return <div ref={layerRef} className="water-fallback-layer" aria-hidden="true" />
}

function WaterCanvas() {
  const canvasRef = useRef(null)
  const [fallback, setFallback] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return

    let water
    try {
      water = createWater(canvas)
    } catch {
      water = null
    }
    if (!water) {
      setFallback(true)
      return
    }
    setFallback(false)

    let raf
    const loop = () => {
      water.step()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // A splash = the site's classic staggered ripple rings, scaled by
    // strength. No surface shimmer — just the hand-drawn rings.
    const splash = (x, y, strength) => {
      if (strength < 0.15) return
      const ringCount = strength >= 0.45 ? 3 : 2
      const size = 0.6 + strength
      for (let i = 0; i < ringCount; i++) {
        water.addRing(x, y, (70 + i * 75) * size, i * 0.16, 1)
      }
    }

    // --- input: moving leaves little hand-drawn concentric rings; clicks splash ---
    let lastX = null
    let lastY = null
    let lastTrail = 0
    const onPointerMove = (e) => {
      if (lastX === null) {
        lastX = e.clientX
        lastY = e.clientY
        return
      }
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      if (Math.hypot(dx, dy) < 10) return
      lastX = e.clientX
      lastY = e.clientY
      // small throttle so a ring appears almost immediately on movement;
      // longer life so each ring expands and fades slowly once it shows
      const now = performance.now()
      if (now - lastTrail < 22) return
      lastTrail = now
      water.addRing(e.clientX, e.clientY, 40, 0, 0.45, 1.6)
    }

    const onPointerDown = (e) => {
      // Lilies and the frog throw their own choreographed splashes.
      if (e.target.closest?.('.lily, .freg')) return
      splash(e.clientX, e.clientY, 0.45, 30)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })

    const offDrop = onWaterDrop(({ x, y, strength, radius }) => {
      splash(x, y, strength, radius)
    })

    // --- faint ambient ripples drift in and fade across the calm pond ---
    let ambientTimeout
    const ambient = () => {
      const x = (0.08 + Math.random() * 0.84) * window.innerWidth
      const y = (0.08 + Math.random() * 0.84) * window.innerHeight
      const big = Math.random() < 0.5
      water.addRing(x, y, 90 + Math.random() * 60, 0, 0.35)
      if (big) water.addRing(x, y, 180 + Math.random() * 80, 0.18, 0.22)
      ambientTimeout = setTimeout(ambient, 4000 + Math.random() * 3000)
    }
    ambientTimeout = setTimeout(ambient, 3500)

    // --- intro: the map draws itself in, then a few drops land ---
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const intro = gsap.timeline({ delay: 0.4 })
    intro
      .to(water.displayMaterial.uniforms.uLineFade, { value: 1, duration: 1.8, ease: 'power2.inOut' }, 0)
      .to(water.displayMaterial.uniforms.uAmp, { value: 1.55, duration: 1.6, ease: 'power2.out' }, 0.4)
      .call(() => splash(cx, cy, 0.5, 44), null, 0.7)
      .call(() => splash(cx - 110, cy + 60, 0.25, 26), null, 1.0)
      .call(() => splash(cx + 130, cy - 40, 0.2, 22), null, 1.25)

    // Map the pond onto the page-ripple-zone: track scroll + zone height
    // so the fixed canvas shows the right vertical slice of the pond.
    const zone = document.querySelector('.page-ripple-zone')
    const updateView = () => {
      const H = window.innerHeight
      const zoneH = zone ? zone.offsetHeight : H * 3
      const zoneTop = zone ? zone.getBoundingClientRect().top + window.scrollY : 0
      water.setView((window.scrollY - zoneTop) / H, zoneH / H)
    }
    updateView()
    // layout can settle after fonts/images load — refresh shortly after
    const viewSettle = setTimeout(updateView, 400)
    window.addEventListener('scroll', updateView, { passive: true })

    let resizeTimeout
    const onResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => { water.resize(); updateView() }, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      intro.kill()
      clearTimeout(ambientTimeout)
      clearTimeout(resizeTimeout)
      clearTimeout(viewSettle)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('scroll', updateView)
      window.removeEventListener('resize', onResize)
      offDrop()
      water.dispose()
    }
  }, [reduced])

  if (reduced) return null
  if (fallback) return <DomRipplesFallback />
  return <canvas ref={canvasRef} className="water-canvas" aria-hidden="true" />
}

export default WaterCanvas

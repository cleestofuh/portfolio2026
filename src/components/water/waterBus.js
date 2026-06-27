// Tiny event bus so any component (lilies, frog, intro) can throw a drop
// into the water without knowing how the surface is rendered.
const listeners = new Set()

export function onWaterDrop(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// x/y are viewport (client) coordinates in CSS pixels.
// strength: signed wave amplitude — negative pushes the surface down.
// radius: drop footprint in CSS pixels.
export function dropWater(x, y, strength = 0.4, radius = 28) {
  listeners.forEach((fn) => fn({ x, y, strength, radius }))
}

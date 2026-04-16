import { useRef, useState, useCallback, useEffect } from 'react'

// Global z-index counter — most recently interacted frame is always on top
let globalZ = 1000

function DraggableFrame({ children, className, frameLabel, initialSelected = false, noResize = false }) {
  const ref = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const sizeRef = useRef(null)
  const originalParentRef = useRef(null)
  const originalNextSiblingRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const [selected, setSelected] = useState(initialSelected)
  const [childSelected, setChildSelected] = useState(false)
  const [detached, setDetached] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  // Store original DOM position on mount for cleanup
  useEffect(() => {
    const el = ref.current
    if (!el) return
    originalParentRef.current = el.parentElement
    originalNextSiblingRef.current = el.nextSibling

    return () => {
      // On unmount: clean up placeholder and restore element
      if (el.__placeholder) {
        el.__placeholder.remove()
        el.__placeholder = null
      }
      if (el.dataset.outOfFlow) {
        // Reset inline styles
        el.style.position = ''
        el.style.left = ''
        el.style.top = ''
        el.style.width = ''
        el.style.height = ''
        el.style.margin = ''
        el.style.transform = ''
        el.style.zIndex = ''
        delete el.dataset.outOfFlow

        // Move back to original position so React can remove it
        const origParent = originalParentRef.current
        const origSibling = originalNextSiblingRef.current
        if (origParent && el.parentElement !== origParent) {
          if (origSibling && origSibling.parentElement === origParent) {
            origParent.insertBefore(el, origSibling)
          } else {
            origParent.appendChild(el)
          }
        }
      }
    }
  }, [])

  // Deselect when another frame broadcasts its selection (unless shift held)
  useEffect(() => {
    const onOtherSelect = (e) => {
      if (e.detail.source === ref.current) return
      if (e.detail.shift) return
      if (ref.current && ref.current.contains(e.detail.source)) return
      setSelected(false)
      setChildSelected(false)
    }
    window.addEventListener('frame-global-select', onOtherSelect)
    return () => window.removeEventListener('frame-global-select', onOtherSelect)
  }, [])

  // Deselect when clicking outside any frame
  useEffect(() => {
    if (!selected) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (!e.target.closest('.draggable-frame')) {
          setSelected(false)
          setChildSelected(false)
        }
      }
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [selected])

  // Listen for child frame-select / frame-deselect (DOM bubbling — works automatically after reparent)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onChildSelect = (e) => {
      if (e.target === el) return
      setChildSelected(true)
      setSelected(true)
    }
    const onChildDeselect = (e) => {
      if (e.target === el) return
      setChildSelected(false)
    }
    el.addEventListener('frame-select', onChildSelect)
    el.addEventListener('frame-deselect', onChildDeselect)
    return () => {
      el.removeEventListener('frame-select', onChildSelect)
      el.removeEventListener('frame-deselect', onChildDeselect)
    }
  }, [])

  // Listen for programmatic selection requests
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onRequestSelect = () => {
      setSelected(true)
      setChildSelected(false)
    }
    el.addEventListener('frame-request-select', onRequestSelect)
    return () => el.removeEventListener('frame-request-select', onRequestSelect)
  }, [])

  // Notify parent of our selection
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (selected && !childSelected) {
      el.dispatchEvent(new Event('frame-select', { bubbles: true }))
    }
    return () => {
      el.dispatchEvent(new Event('frame-deselect', { bubbles: true }))
    }
  }, [selected, childSelected])

  // Find the smallest containing frame for this element's center
  const findContainingFrame = useCallback(() => {
    const el = ref.current
    if (!el) return null

    const childRect = el.getBoundingClientRect()
    const childCenterX = childRect.left + childRect.width / 2
    const childCenterY = childRect.top + childRect.height / 2

    const allFrames = document.querySelectorAll('.draggable-frame')
    let bestFrame = null
    let bestArea = Infinity

    allFrames.forEach((frame) => {
      if (frame === el) return
      if (el.contains(frame)) return // skip our descendants

      const rect = frame.getBoundingClientRect()
      const inside =
        childCenterX >= rect.left &&
        childCenterX <= rect.right &&
        childCenterY >= rect.top &&
        childCenterY <= rect.bottom

      if (inside) {
        const area = rect.width * rect.height
        if (area < bestArea) {
          bestArea = area
          bestFrame = frame
        }
      }
    })

    return bestFrame
  }, [])

  // Move the DOM element into a new container, preserving visual position
  const moveTo = useCallback((target) => {
    const el = ref.current
    if (!el || target === el.parentElement) return

    const cardRect = el.getBoundingClientRect()

    target.appendChild(el)

    const newOffsetParent = el.offsetParent || document.body
    const parentRect = newOffsetParent.getBoundingClientRect()

    el.style.left = `${cardRect.left - posRef.current.x - parentRect.left}px`
    el.style.top = `${cardRect.top - posRef.current.y - parentRect.top}px`
  }, [])

  // Find the outermost non-frame container (grid-canvas, about-page-inner, etc.)
  const findCanvasRoot = useCallback(() => {
    const el = ref.current
    if (!el) return document.body
    let node = el.parentElement
    let lastNonFrame = document.body
    while (node) {
      if (!node.classList?.contains('draggable-frame')) {
        lastNonFrame = node
      }
      // Stop at major page containers
      if (node.classList?.contains('grid-canvas') ||
          node.classList?.contains('about-page-inner') ||
          node.classList?.contains('about-page--grid')) {
        return node
      }
      node = node.parentElement
    }
    return lastNonFrame
  }, [])

  const checkContainment = useCallback(() => {
    const el = ref.current
    if (!el || !el.dataset.outOfFlow) return

    const newParent = findContainingFrame()
    const currentParentFrame = el.parentElement?.closest('.draggable-frame')

    if (newParent && newParent !== currentParentFrame) {
      // Move into the new container
      moveTo(newParent)
      setDetached(false)
    } else if (!newParent && currentParentFrame) {
      // Dragged outside all containers — move to the canvas root
      moveTo(findCanvasRoot())
      setDetached(true)
    } else if (!newParent) {
      setDetached(true)
    } else {
      setDetached(false)
    }
  }, [findContainingFrame, moveTo, findCanvasRoot])

  // Pull element out of layout flow
  const pullOutOfFlow = useCallback((el) => {
    if (el.dataset.outOfFlow) return
    const rect = el.getBoundingClientRect()
    const parent = el.offsetParent || document.body
    const parentRect = parent.getBoundingClientRect()

    // Insert placeholder to hold original space in the layout
    const placeholder = document.createElement('div')
    placeholder.style.width = `${rect.width}px`
    placeholder.style.height = `${rect.height}px`
    placeholder.style.visibility = 'hidden'
    placeholder.dataset.placeholder = 'true'
    el.parentNode.insertBefore(placeholder, el)
    el.__placeholder = placeholder

    const baseLeft = rect.left - parentRect.left - posRef.current.x
    const baseTop = rect.top - parentRect.top - posRef.current.y
    el.style.position = 'absolute'
    el.style.left = `${baseLeft}px`
    el.style.top = `${baseTop}px`
    el.style.width = `${rect.width}px`
    el.style.height = `${rect.height}px`
    el.style.margin = '0'
    el.dataset.outOfFlow = 'true'
    sizeRef.current = { w: rect.width, h: rect.height }
  }, [])

  // Bring element to front
  const bringToFront = useCallback((el) => {
    globalZ += 1
    el.style.zIndex = String(globalZ)
  }, [])

  // Resize handler
  const handleResizeDown = useCallback((e, corner) => {
    e.preventDefault()
    e.stopPropagation()
    setResizing(true)
    setSelected(true)
    setChildSelected(false)

    window.dispatchEvent(new CustomEvent('frame-global-select', {
      detail: { source: ref.current, shift: e.shiftKey },
    }))

    const el = ref.current
    if (!el) return

    pullOutOfFlow(el)
    bringToFront(el)

    const rect = el.getBoundingClientRect()
    if (!sizeRef.current) {
      sizeRef.current = { w: rect.width, h: rect.height }
    }

    const startX = e.clientX
    const startY = e.clientY
    const startW = sizeRef.current.w
    const startH = sizeRef.current.h
    const startPos = { ...posRef.current }

    const onMouseMove = (moveE) => {
      const dx = moveE.clientX - startX
      const dy = moveE.clientY - startY
      let newW = startW
      let newH = startH
      let newX = startPos.x
      let newY = startPos.y

      if (corner.includes('r')) newW = Math.max(120, startW + dx)
      if (corner.includes('l')) {
        newW = Math.max(120, startW - dx)
        newX = startPos.x + (startW - newW)
      }
      if (corner.includes('b')) newH = Math.max(60, startH + dy)
      if (corner.includes('t')) {
        newH = Math.max(60, startH - dy)
        newY = startPos.y + (startH - newH)
      }

      sizeRef.current = { w: newW, h: newH }
      posRef.current = { x: newX, y: newY }

      if (el) {
        el.style.width = `${newW}px`
        el.style.height = `${newH}px`
        el.style.transform = `translate(${newX}px, ${newY}px)`
      }
    }

    const onMouseUp = () => {
      setResizing(false)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [pullOutOfFlow, bringToFront])

  // Native mousedown for drag
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseDown = (e) => {
      if (e.target.closest('a, button, input, textarea, select')) return
      if (e.button !== 0) return
      if (e.target.closest('.grid-resize-edge, .grid-selection-handle')) return

      const closestFrame = e.target.closest('.draggable-frame')
      if (closestFrame !== el) {
        setSelected(true)
        setChildSelected(true)
        return
      }

      e.preventDefault()
      e.stopPropagation()
      setSelected(true)
      setChildSelected(false)
      setDragging(true)

      window.dispatchEvent(new CustomEvent('frame-global-select', {
        detail: { source: el, shift: e.shiftKey },
      }))

      pullOutOfFlow(el)
      bringToFront(el)

      const startX = e.clientX
      const startY = e.clientY
      const startPos = { ...posRef.current }
      let lastPos = { ...startPos }

      const onMouseMove = (moveE) => {
        const dx = moveE.clientX - startX
        const dy = moveE.clientY - startY
        const newX = startPos.x + dx
        const newY = startPos.y + dy

        const moveDx = newX - lastPos.x
        const moveDy = newY - lastPos.y
        lastPos = { x: newX, y: newY }

        posRef.current = { x: newX, y: newY }
        el.style.transform = `translate(${newX}px, ${newY}px)`

        // Dispatch frame-move for children that move with this container
        el.dispatchEvent(new CustomEvent('frame-move', {
          detail: { dx: moveDx, dy: moveDy },
        }))

        setCoords({ x: Math.round(newX), y: Math.round(newY) })
        checkContainment()
      }

      const onMouseUp = () => {
        setDragging(false)
        checkContainment()
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    }

    el.addEventListener('mousedown', handleMouseDown)
    return () => el.removeEventListener('mousedown', handleMouseDown)
  }, [checkContainment, pullOutOfFlow, bringToFront])

  // Native listeners for resize handles
  useEffect(() => {
    const el = ref.current
    if (!el || noResize) return

    const onResizeMouseDown = (e) => {
      const edge = e.target.closest('.grid-resize-edge')
      const handle = e.target.closest('.grid-selection-handle')
      if (!edge && !handle) return

      let corner = ''
      if (edge) {
        if (edge.classList.contains('grid-resize-edge--t')) corner = 't'
        else if (edge.classList.contains('grid-resize-edge--r')) corner = 'r'
        else if (edge.classList.contains('grid-resize-edge--b')) corner = 'b'
        else if (edge.classList.contains('grid-resize-edge--l')) corner = 'l'
      } else if (handle) {
        if (handle.classList.contains('grid-selection-handle--tl')) corner = 'tl'
        else if (handle.classList.contains('grid-selection-handle--tr')) corner = 'tr'
        else if (handle.classList.contains('grid-selection-handle--bl')) corner = 'bl'
        else if (handle.classList.contains('grid-selection-handle--br')) corner = 'br'
      }

      if (corner) handleResizeDown(e, corner)
    }

    el.addEventListener('mousedown', onResizeMouseDown, true)
    return () => el.removeEventListener('mousedown', onResizeMouseDown, true)
  }, [noResize, handleResizeDown])

  const active = selected && !childSelected
  const showBorder = active || dragging || resizing
  const showHandles = active || dragging || resizing

  const classes = [
    'draggable-frame',
    className || '',
    dragging ? 'draggable-frame--dragging' : '',
    resizing ? 'draggable-frame--resizing' : '',
    selected ? 'draggable-frame--selected' : '',
    childSelected ? 'draggable-frame--child-selected' : '',
    detached ? 'draggable-frame--detached' : '',
  ].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={classes}>
      {frameLabel && (
        <span className={`grid-frame-label ${active ? 'grid-frame-label--active' : ''}`}>
          {frameLabel}
        </span>
      )}
      {dragging && (
        <span className="drag-coords">
          X: {coords.x} &nbsp; Y: {coords.y}
        </span>
      )}
      {children}
      <div className={`drag-selection-border ${showBorder ? 'drag-selection-border--visible' : ''} ${childSelected && !detached ? 'drag-selection-border--parent' : ''}`} />
      {!noResize && (
        <>
          <div className={`grid-resize-edge grid-resize-edge--t ${showHandles ? 'grid-resize-edge--visible' : ''}`} />
          <div className={`grid-resize-edge grid-resize-edge--r ${showHandles ? 'grid-resize-edge--visible' : ''}`} />
          <div className={`grid-resize-edge grid-resize-edge--b ${showHandles ? 'grid-resize-edge--visible' : ''}`} />
          <div className={`grid-resize-edge grid-resize-edge--l ${showHandles ? 'grid-resize-edge--visible' : ''}`} />
          <div className={`grid-selection-handle grid-selection-handle--tl ${showHandles ? 'grid-selection-handle--visible' : ''}`} />
          <div className={`grid-selection-handle grid-selection-handle--tr ${showHandles ? 'grid-selection-handle--visible' : ''}`} />
          <div className={`grid-selection-handle grid-selection-handle--bl ${showHandles ? 'grid-selection-handle--visible' : ''}`} />
          <div className={`grid-selection-handle grid-selection-handle--br ${showHandles ? 'grid-selection-handle--visible' : ''}`} />
        </>
      )}
    </div>
  )
}

export default DraggableFrame

import { useRef, useState } from 'react'

const MIN_WIDTH = 280
const MIN_HEIGHT = 220

// Where the window starts, based on the viewport at the moment it opens —
// roughly centered-right so it doesn't immediately cover the question.
function initialGeometry() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const width = Math.min(460, vw - 40)
  const height = Math.min(560, vh - 120)
  return {
    x: Math.max(20, vw - width - 40),
    y: Math.max(80, (vh - height) / 2),
    width,
    height,
  }
}

export default function FloatingPassageWindow({ passage, onClose }) {
  const [geo, setGeo] = useState(initialGeometry)
  const dragState = useRef(null)
  const resizeState = useRef(null)

  function handleDragStart(e) {
    // Only the header itself should start a drag — not clicks on the
    // close button, which is also inside it.
    if (e.target.closest('.floating-passage-close')) return
    dragState.current = { startX: e.clientX, startY: e.clientY, startGeo: geo }
    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('mouseup', handleDragEnd)
  }

  function handleDragMove(e) {
    const { startX, startY, startGeo } = dragState.current
    setGeo((g) => ({
      ...g,
      x: startGeo.x + (e.clientX - startX),
      y: startGeo.y + (e.clientY - startY),
    }))
  }

  function handleDragEnd() {
    dragState.current = null
    window.removeEventListener('mousemove', handleDragMove)
    window.removeEventListener('mouseup', handleDragEnd)
  }

  function handleResizeStart(e) {
    e.stopPropagation()
    resizeState.current = { startX: e.clientX, startY: e.clientY, startGeo: geo }
    window.addEventListener('mousemove', handleResizeMove)
    window.addEventListener('mouseup', handleResizeEnd)
  }

  function handleResizeMove(e) {
    const { startX, startY, startGeo } = resizeState.current
    setGeo((g) => ({
      ...g,
      width: Math.max(MIN_WIDTH, startGeo.width + (e.clientX - startX)),
      height: Math.max(MIN_HEIGHT, startGeo.height + (e.clientY - startY)),
    }))
  }

  function handleResizeEnd() {
    resizeState.current = null
    window.removeEventListener('mousemove', handleResizeMove)
    window.removeEventListener('mouseup', handleResizeEnd)
  }

  return (
    <div className="floating-passage" style={{ left: geo.x, top: geo.y, width: geo.width, height: geo.height }}>
      <div className="floating-passage-header" onMouseDown={handleDragStart}>
        <span className="floating-passage-title">📖 {passage.title || 'Текст для чтения'}</span>
        <button type="button" className="floating-passage-close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
      </div>
      <div className="floating-passage-body">
        {passage.title && <h3>{passage.title}</h3>}
        <div className="test-passage-text">{passage.text}</div>
      </div>
      <div className="floating-passage-resize" onMouseDown={handleResizeStart} aria-hidden="true" />
    </div>
  )
}

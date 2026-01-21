import { useRef, useState } from 'react'

export default function useReorder(items = [], onChange) {
  const dragIndex = useRef(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  function onDragStart(e, idx) {
    dragIndex.current = idx
    try {
      e.dataTransfer.setData('text/plain', String(idx))
    } catch (err) {}
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
    e.currentTarget && e.currentTarget.classList && e.currentTarget.classList.add('dragging')
  }

  function onDragEnd(e) {
    dragIndex.current = null
    setDragOverIndex(null)
    e.currentTarget && e.currentTarget.classList && e.currentTarget.classList.remove('dragging')
  }

  function onDragOver(e, idx) {
    e.preventDefault()
    if (dragOverIndex !== idx) setDragOverIndex(idx)
  }

  function onDrop(e, idx) {
    e.preventDefault()
    const from =
      dragIndex.current != null
        ? dragIndex.current
        : Number(e.dataTransfer.getData('text/plain'))
    const to = idx
    if (from === to || from == null) {
      setDragOverIndex(null)
      return
    }
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange && onChange(next)
    setDragOverIndex(null)
  }

  function move(idx, delta) {
    const to = idx + delta
    if (to < 0 || to >= items.length) return
    const next = [...items]
    const [moved] = next.splice(idx, 1)
    next.splice(to, 0, moved)
    onChange && onChange(next)
  }

  return {
    dragOverIndex,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    move,
  }
}

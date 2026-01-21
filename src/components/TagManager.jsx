import React, { useRef, useState } from 'react'

export default function TagManager({ tags = [], presetTags = [], onChangeTags }) {
  const [newTag, setNewTag] = useState('')
  const tagDragIndex = useRef(null)
  const [tagDragOverIndex, setTagDragOverIndex] = useState(null)

  function onTagDragStart(e, idx) {
    tagDragIndex.current = idx
    try { e.dataTransfer.setData('text/plain', String(idx)) } catch (err) {}
    e.dataTransfer.effectAllowed = 'move'
    e.currentTarget.classList && e.currentTarget.classList.add('dragging')
  }

  function onTagDragEnd(e) {
    tagDragIndex.current = null
    setTagDragOverIndex(null)
    e.currentTarget.classList && e.currentTarget.classList.remove('dragging')
  }

  function onTagDragOver(e, idx) {
    e.preventDefault()
    if (tagDragOverIndex !== idx) setTagDragOverIndex(idx)
  }

  function onTagDrop(e, idx) {
    e.preventDefault()
    const from = tagDragIndex.current != null ? tagDragIndex.current : Number(e.dataTransfer.getData('text/plain'))
    const to = idx
    if (from == null || from === to) {
      setTagDragOverIndex(null)
      return
    }
    const next = [...(tags || [])]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChangeTags && onChangeTags(next)
    setTagDragOverIndex(null)
  }

  function moveTag(idx, delta) {
    const to = idx + delta
    if (to < 0 || to >= (tags || []).length) return
    const next = [...(tags || [])]
    const [moved] = next.splice(idx, 1)
    next.splice(to, 0, moved)
    onChangeTags && onChangeTags(next)
  }

  function toggleTag(tag) {
    const has = tags && tags.includes(tag)
    const next = has ? tags.filter((t) => t !== tag) : [...(tags || []), tag]
    onChangeTags && onChangeTags(next)
  }

  function addNewTag() {
    const tag = newTag.trim()
    if (!tag) return
    const next = [...(tags || [])]
    if (!next.includes(tag)) next.push(tag)
    onChangeTags && onChangeTags(next)
    setNewTag('')
  }

  function removeTag(tag) {
    const next = (tags || []).filter((t) => t !== tag)
    onChangeTags && onChangeTags(next)
  }

  return (
    <section>
      <h3 style={{ marginTop: 8 }}>🏷️ Catégories</h3>
      <div className="tags-row">
        {presetTags.map((t) => {
          const active = tags && tags.includes(t)
          return (
            <button
              key={t}
              type="button"
              className={`btn small ${active ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => toggleTag(t)}
              aria-pressed={active}
              title={t}
            >
              {t}
            </button>
          )
        })}
      </div>

      <div className="tag-add-row">
        <input
          placeholder="Ajouter une catégorie personnalisée"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNewTag() } }}
        />
        <button className="btn" type="button" onClick={addNewTag} title="Ajouter la catégorie">➕ Ajouter</button>
      </div>

      <div className="tags-list">
        {(tags || []).map((t, idx) => (
          <span
            key={t}
            className={`tag-chip ${tagDragOverIndex === idx ? 'drag-over' : ''}`}
            draggable
            onDragStart={(e) => onTagDragStart(e, idx)}
            onDragOver={(e) => onTagDragOver(e, idx)}
            onDrop={(e) => onTagDrop(e, idx)}
            onDragEnd={onTagDragEnd}
            tabIndex={0}
            title={t}
            onKeyDown={(e) => {
              if (!e.ctrlKey) return
              if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') moveTag(idx, -1)
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') moveTag(idx, 1)
            }}
          >
            {t}
            <button className="icon-btn" onClick={() => removeTag(t)} aria-label={`Supprimer tag ${t}`}>✕</button>
          </span>
        ))}
      </div>

      <p className="muted-text">💡 Cliquez sur une catégorie pour la sélectionner</p>
    </section>
  )
}

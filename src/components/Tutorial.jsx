import React, { useState, useEffect, useRef } from 'react'

export default function Tutorial({ onClose }) {
  // Steps include an optional selector to attach the pointer to
  const steps = [
    { key: 'start', title: 'Commencer', content: 'Bienvenue ! Ce tutoriel interactif vous guide pas à pas pour créer et exporter une recette.', selector: null },
    { key: 'title', title: 'Titre', content: "Remplissez le nom de la recette ici.", selector: '[data-tutorial="title"]' },
    { key: 'image', title: 'Ajouter une photo', content: "Ajoutez une photo pour enrichir la recette (input fichier).", selector: '[data-tutorial="image"]' },
    { key: 'add-ingredient', title: 'Ingrédients', content: "Ajoutez des ingrédients et réordonnez-les avec les flèches.", selector: '.btn[title="Ajouter un ingrédient"]' },
    { key: 'save', title: 'Sauvegarder', content: "Cliquez sur Enregistrer pour sauvegarder la recette.", selector: '[data-tutorial="save"]' },
    { key: 'preview', title: 'Aperçu', content: "L'aperçu à droite montre le rendu final. Vous pouvez l'imprimer ou le télécharger en PDF.", selector: '[data-tutorial="preview"]' }
  ]

  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState(null)
  const tooltipRef = useRef(null)

  useEffect(() => {
    function updatePos() {
      const step = steps[index]
      if (!step.selector) {
        setRect(null)
        return
      }
      const el = document.querySelector(step.selector)
      if (!el) {
        setRect(null)
        return
      }
      const r = el.getBoundingClientRect()
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
      // scroll into view if off-screen
      if (r.top < 0 || r.bottom > window.innerHeight) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }

    // initial update and on resize
    updatePos()
    window.addEventListener('resize', updatePos)
    window.addEventListener('scroll', updatePos, true)
    return () => {
      window.removeEventListener('resize', updatePos)
      window.removeEventListener('scroll', updatePos, true)
    }
  }, [index])

  function next() {
    setIndex(i => Math.min(i + 1, steps.length - 1))
  }

  function prev() {
    setIndex(i => Math.max(i - 1, 0))
  }

  function close() {
    if (onClose) onClose()
  }

  // compute tooltip position based on rect
  let tooltipStyle = {}
  let arrowClass = 'bottom'
  if (rect) {
    // default: place tooltip above target if space, otherwise below
    const spaceAbove = rect.top
    const spaceBelow = window.innerHeight - (rect.top + rect.height)
    const preferAbove = spaceAbove > 200 || spaceAbove > spaceBelow
    if (preferAbove) {
      tooltipStyle = { position: 'fixed', left: rect.left + rect.width / 2, top: rect.top - 12 }
      arrowClass = 'bottom'
    } else {
      tooltipStyle = { position: 'fixed', left: rect.left + rect.width / 2, top: rect.top + rect.height + 12 }
      arrowClass = 'top'
    }
  }

  return (
    <>
      <div className="tutorial-overlay" onClick={close} />

      {rect && (
        <div className="tutorial-highlight" style={{position:'fixed',left:rect.left - 6,top:rect.top - 6,width:rect.width + 12,height:rect.height + 12}} />
      )}

      <div className="tutorial-panel" role="dialog" aria-modal="true" aria-label="Tutoriel pas à pas">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <strong>📖 Tutoriel — Étape {index + 1} / {steps.length}</strong>
          <div style={{display:'flex',gap:8}}>
            <button className="btn" onClick={close}>Fermer</button>
          </div>
        </div>

        <div style={{marginBottom:16}}>
          <h3 style={{margin:'6px 0 8px 0',color:'var(--accent)'}}>{steps[index].title}</h3>
          <div className="muted-text">{steps[index].content}</div>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',gap:12}}>
          <div>
            <button className="btn" onClick={prev} disabled={index === 0}>◀ Précédent</button>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn" onClick={() => setIndex(0)}>Début</button>
            <button className="btn btn-primary" onClick={next} disabled={index === steps.length - 1}>{index === steps.length - 1 ? 'Terminé' : 'Suivant ▶'}</button>
          </div>
        </div>
      </div>

      {/* Tooltip pointer anchored to target */}
      {rect && (
        <div ref={tooltipRef} className={`tutorial-tooltip ${arrowClass}`} style={tooltipStyle}>
          <div className="tutorial-arrow" />
        </div>
      )}
    </>
  )
}

import React from 'react'

export default function StepsList({
  steps = [],
  dragOverIndex,
  onStepDragOver,
  onStepDrop,
  onStepDragStart,
  onStepDragEnd,
  moveStep,
  updateStep,
  removeStep,
  addStep,
  autoResize,
}) {
  return (
    <section>
      <h3>👩‍🍳 Étapes de préparation</h3>
      <p className="muted-text">
        Utilisez les flèches <strong>▲</strong> et <strong>▼</strong> pour
        changer l'ordre.
      </p>
      {(steps || []).map((s, idx) => (
        <div
          key={idx}
          className={`list-row ${dragOverIndex === idx ? 'drag-over' : ''}`}
          onDragOver={(e) => onStepDragOver(e, idx)}
          onDrop={(e) => onStepDrop(e, idx)}
        >
          <div className="step-controls">
            <span
              className="drag-handle"
              title="Déplacer étape"
              role="button"
              tabIndex={0}
              draggable
              onDragStart={(e) => onStepDragStart(e, idx)}
              onDragEnd={onStepDragEnd}
              onKeyDown={(e) => {
                if (!e.ctrlKey) return;
                if (e.key === 'ArrowUp' && idx > 0) moveStep(idx, -1);
                if (e.key === 'ArrowDown' && idx < steps.length - 1) moveStep(idx, 1);
              }}
            >
              ≡
            </span>
            <button
              type="button"
              className="btn small"
              onClick={() => moveStep(idx, -1)}
              aria-label={`Déplacer étape ${idx + 1} vers le haut`}
              disabled={idx === 0}
              title="Monter cette étape"
            >
              ▲
            </button>
            <button
              type="button"
              className="btn small"
              onClick={() => moveStep(idx, 1)}
              aria-label={`Déplacer étape ${idx + 1} vers le bas`}
              disabled={idx === steps.length - 1}
              title="Descendre cette étape"
            >
              ▼
            </button>
          </div>
          <textarea
            className="auto-resize"
            value={s}
            onChange={(e) => {
              updateStep(idx, e.target.value);
              autoResize(e);
            }}
            onInput={autoResize}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="ex: Préchauffer le four à 180°C..."
          />
          <button
            className="btn btn-icon"
            onClick={() => removeStep(idx)}
            aria-label={`Supprimer étape ${idx}`}
            title="Supprimer cette étape"
          >
            ✕
          </button>
        </div>
      ))}
      <button className="btn btn-primary" onClick={addStep} title="Ajouter une étape">
        ➕ Ajouter une étape
      </button>
    </section>
  )
}

import React from 'react'

export default function IngredientsList({
  ingredients = [],
  ingDragOverIndex,
  onIngredientDragOver,
  onIngredientDrop,
  onIngredientDragStart,
  onIngredientDragEnd,
  moveIngredient,
  updateIngredient,
  removeIngredient,
  addIngredient,
  autoResize,
}) {
  return (
    <section>
      <h3>🥕 Ingrédients</h3>
      <p className="muted-text">
        Utilisez les flèches <strong>▲</strong> et <strong>▼</strong> pour
        changer l'ordre.
      </p>
      {(ingredients || []).map((ing, idx) => (
        <div
          key={idx}
          className={`list-row ${ingDragOverIndex === idx ? 'drag-over' : ''}`}
          onDragOver={(e) => onIngredientDragOver(e, idx)}
          onDrop={(e) => onIngredientDrop(e, idx)}
        >
          <div className="step-controls">
            <span
              className="drag-handle"
              title="Déplacer ingrédient"
              role="button"
              tabIndex={0}
              draggable
              onDragStart={(e) => onIngredientDragStart(e, idx)}
              onDragEnd={onIngredientDragEnd}
              onKeyDown={(e) => {
                if (!e.ctrlKey) return;
                if (e.key === 'ArrowUp' && idx > 0) moveIngredient(idx, -1);
                if (e.key === 'ArrowDown' && idx < ingredients.length - 1)
                  moveIngredient(idx, 1);
              }}
            >
              ≡
            </span>
            <button
              type="button"
              className="btn small"
              onClick={() => moveIngredient(idx, -1)}
              aria-label={`Déplacer ingrédient ${idx + 1} vers le haut`}
              disabled={idx === 0}
              title="Monter cet ingrédient"
            >
              ▲
            </button>
            <button
              type="button"
              className="btn small"
              onClick={() => moveIngredient(idx, 1)}
              aria-label={`Déplacer ingrédient ${idx + 1} vers le bas`}
              disabled={idx === ingredients.length - 1}
              title="Descendre cet ingrédient"
            >
              ▼
            </button>
          </div>
          <textarea
            className="ingredient-input auto-resize"
            rows={1}
            value={ing}
            onChange={(e) => {
              updateIngredient(idx, e.target.value);
              autoResize(e);
            }}
            onInput={autoResize}
            onKeyDown={(e) => e.stopPropagation()}
            placeholder="ex: 250g de farine"
          />
          <button
            className="btn btn-icon"
            onClick={() => removeIngredient(idx)}
            aria-label={`Supprimer ingrédient ${idx}`}
            title="Supprimer cet ingrédient"
          >
            ✕
          </button>
        </div>
      ))}
      <button className="btn btn-primary" onClick={addIngredient} title="Ajouter un ingrédient">
        ➕ Ajouter un ingrédient
      </button>
    </section>
  )
}

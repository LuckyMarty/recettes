import React from 'react'

export default function RecipeEditor({ recipe, onChange }) {
  function updateField(key, value) {
    onChange({ [key]: value })
  }

  function updateIngredient(idx, value) {
    const next = [...recipe.ingredients]
    next[idx] = value
    onChange({ ingredients: next })
  }

  function addIngredient() {
    onChange({ ingredients: [...recipe.ingredients, ''] })
  }

  function removeIngredient(idx) {
    const next = recipe.ingredients.filter((_, i) => i !== idx)
    onChange({ ingredients: next })
  }

  function updateStep(idx, value) {
    const next = [...recipe.steps]
    next[idx] = value
    onChange({ steps: next })
  }

  function addStep() {
    onChange({ steps: [...recipe.steps, ''] })
  }

  function removeStep(idx) {
    const next = recipe.steps.filter((_, i) => i !== idx)
    onChange({ steps: next })
  }

  return (
    <div className="editor">
      <label>Nom de la recette
        <input value={recipe.title} onChange={(e) => updateField('title', e.target.value)} />
      </label>

      <label>Sous-titre
        <input value={recipe.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} />
      </label>

      <div className="row">
        <label>Personnes
          <input value={recipe.servings} onChange={(e) => updateField('servings', e.target.value)} />
        </label>
        <label>Préparation
          <input value={recipe.prepTime} onChange={(e) => updateField('prepTime', e.target.value)} />
        </label>
        <label>Cuisson
          <input value={recipe.cookTime} onChange={(e) => updateField('cookTime', e.target.value)} />
        </label>
      </div>

      <section>
        <h3>Ingrédients</h3>
        {recipe.ingredients.map((ing, idx) => (
          <div key={idx} className="list-row">
            <input value={ing} onChange={(e) => updateIngredient(idx, e.target.value)} />
            <button onClick={() => removeIngredient(idx)} aria-label={`Supprimer ingrédient ${idx}`}>✕</button>
          </div>
        ))}
        <button onClick={addIngredient}>Ajouter un ingrédient</button>
      </section>

      <section>
        <h3>Étapes</h3>
        {recipe.steps.map((s, idx) => (
          <div key={idx} className="list-row">
            <textarea value={s} onChange={(e) => updateStep(idx, e.target.value)} />
            <button onClick={() => removeStep(idx)} aria-label={`Supprimer étape ${idx}`}>✕</button>
          </div>
        ))}
        <button onClick={addStep}>Ajouter une étape</button>
      </section>
    </div>
  )
}

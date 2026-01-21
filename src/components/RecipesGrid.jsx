import React from 'react'
import RecipeCard from './RecipeCard.jsx'

export default function RecipesGrid({ recipes = [], onView, onEdit, onDelete }) {
  if (!recipes || recipes.length === 0) return null
  return (
    <div className="recipes-grid">
      {recipes.map(r => (
        <RecipeCard key={r.id || r._tempId || JSON.stringify(r)} recipe={r} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

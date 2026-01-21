import React from 'react'

export default function RecipeCard({ recipe, onView, onEdit, onDelete }) {
  return (
    <div className="recipe-card-item">
      {recipe.image && <img src={recipe.image} alt={recipe.title} className="recipe-card-thumb" />}
      <div className="recipe-card-content">
        <h4 className="recipe-card-title">{recipe.title || 'Sans titre'}</h4>
        {recipe.subtitle && <p className="recipe-card-subtitle">{recipe.subtitle}</p>}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="recipe-card-tags">
            {recipe.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="mini-tag">{tag}</span>
            ))}
          </div>
        )}
        {(recipe.createdAt || recipe.updatedAt) && (
          <div className="recipe-card-dates">
            {recipe.createdAt && <span className="date-item">📅 {new Date(recipe.createdAt).toLocaleDateString('fr-FR')}</span>}
            {recipe.updatedAt && recipe.updatedAt !== recipe.createdAt && <span className="date-item">🔄 {new Date(recipe.updatedAt).toLocaleDateString('fr-FR')}</span>}
          </div>
        )}
      </div>
      <div className="recipe-card-actions">
        <button className="btn small btn-ghost" onClick={() => onView && onView(recipe)} title="Lire la recette">👁️ Lire</button>
        <button className="btn small btn-primary" onClick={() => onEdit && onEdit(recipe)}>✏️ Modifier</button>
        <button className="btn small btn-ghost" onClick={() => onDelete && onDelete(recipe.id)}>🗑️</button>
      </div>
    </div>
  )
}

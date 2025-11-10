import React from 'react'

export default function RecipePreview({ recipe }) {
  return (
    <article className="recipe-card">
      <header>
        <h2>{recipe.title}</h2>
        <p className="subtitle">{recipe.subtitle}</p>
        <div className="meta">
          <span>Personnes: {recipe.servings}</span>
          <span>Préparation: {recipe.prepTime}</span>
          <span>Cuisson: {recipe.cookTime}</span>
        </div>
      </header>

      <section>
        <h3>Ingrédients</h3>
        <ul>
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Étapes</h3>
        <ol>
          {recipe.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      <footer className="print-note">Recette générée avec amour — Imprimez ou enregistrez en PDF</footer>
    </article>
  )
}

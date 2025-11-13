import React from 'react'

export default function RecipePreview({ recipe }) {
  return (
    <>
    <article className={`recipe-card ${recipe.image ? 'has-image' : ''}`}>
      {recipe.image && (
        <img src={recipe.image} alt="Photo de la recette" className="recipe-image" />
      )}
      <header>
        <h2>{recipe.title}</h2>
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="preview-tags" style={{marginTop:8}}>
            {(recipe.tags || []).map((t) => (
              <span key={t} className="tag-chip preview">{t}</span>
            ))}
          </div>
        )}
        <p className="subtitle">{recipe.subtitle}</p>
        <div className="meta">
          <div className="meta-item">
            <svg className="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="currentColor" />
              <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4v1H6v-1z" fill="currentColor" />
            </svg>
            <span>Personnes :</span>
            <strong>{recipe.servings}</strong>
          </div>
          <div className="meta-item">
            <svg className="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 8v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            <span>Préparation :</span>
            <strong>{recipe.prepTime}</strong>
          </div>
          <div className="meta-item">
            <svg className="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M7 7h10M7 11h10M7 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Cuisson :</span>
            <strong>{recipe.cookTime}</strong>
          </div>
        </div>
        {/* {(recipe.createdAt || recipe.updatedAt) && (
          <div className="preview-dates" style={{marginTop: 12, fontSize: '13px', color: 'var(--text-muted)'}}>
            {recipe.createdAt && <div>📅 Créée le {new Date(recipe.createdAt).toLocaleDateString('fr-FR')}</div>}
            {recipe.updatedAt && recipe.updatedAt !== recipe.createdAt && <div>🔄 Modifiée le {new Date(recipe.updatedAt).toLocaleDateString('fr-FR')}</div>}
          </div>
        )} */}
      </header>

      <section>
        <h3>Ingrédients</h3>
        <table className="ingredients-table" aria-label="Ingrédients">
          <tbody>
            {(recipe.ingredients || []).map((ing, i) => (
              <tr key={i} className="ingredient-row">
                <td className="ing-desc">{ing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Étapes</h3>
        <table className="steps-table" aria-label="Étapes de la recette">
          <tbody>
            {(recipe.steps || []).map((s, i) => (
              <tr key={i} className="step-row">
                <td className="step-num" aria-hidden>{i + 1}</td>
                <td className="step-desc">{s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="print-note"></footer>
    </article>
    </>
  )
}

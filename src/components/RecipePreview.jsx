import React from 'react'

export default function RecipePreview({ recipe, globalPrintDefaults }) {
  // Compute inline styles from recipe.print for immediate live preview updates
  const print = recipe.print || globalPrintDefaults || {}
  const unit = print.marginUnit || 'mm'
  const articleStyle = {
    fontSize: print.bodyFontSize ? `${print.bodyFontSize}px` : undefined,
    paddingTop: print.marginTop != null ? `${print.marginTop}${unit}` : undefined,
    paddingBottom: print.marginBottom != null ? `${print.marginBottom}${unit}` : undefined,
    paddingLeft: print.marginLeft != null ? `${print.marginLeft}${unit}` : undefined,
    paddingRight: print.marginRight != null ? `${print.marginRight}${unit}` : undefined,
    borderRadius: 0,
  }
  const titleStyle = { fontSize: print.titleFontSize ? `${print.titleFontSize}px` : undefined }
  const subtitleStyle = { fontSize: print.subtitleFontSize ? `${print.subtitleFontSize}px` : undefined }
  const ingredientsBodyVal = print.ingredientsBodyFontSize != null ? print.ingredientsBodyFontSize : print.ingredientsFontSize
  const stepsBodyVal = print.stepsBodyFontSize != null ? print.stepsBodyFontSize : print.stepsFontSize
  const ingredientsStyle = { fontSize: ingredientsBodyVal != null ? `${ingredientsBodyVal}px` : undefined }
  const stepsStyle = { fontSize: stepsBodyVal != null ? `${stepsBodyVal}px` : undefined }
  const stepNumStyle = { fontSize: print.stepNumberFontSize ? `${print.stepNumberFontSize}px` : undefined }
  const categoriesStyle = { fontSize: print.categoriesFontSize ? `${print.categoriesFontSize}px` : undefined }
  const metaStyle = { fontSize: print.metaFontSize ? `${print.metaFontSize}px` : undefined }
  const hasMeta = recipe.servings || recipe.prepTime || recipe.cookTime
  const ingredientsTitleStyle = { fontSize: print.ingredientsTitleFontSize ? `${print.ingredientsTitleFontSize}px` : undefined }
  const stepsTitleStyle = { fontSize: print.stepsTitleFontSize ? `${print.stepsTitleFontSize}px` : undefined }

  return (
    <>
    <article className={`recipe-card ${recipe.image ? 'has-image' : ''}`} style={articleStyle}>
      {recipe.image && (
        <img src={recipe.image} alt="Photo de la recette" className="recipe-image" />
      )}
      <header>
        <h2 style={titleStyle}>{recipe.title}</h2>
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="preview-tags" style={{marginTop:8, ...(categoriesStyle || {})}}>
            {(recipe.tags || []).map((t) => (
              <span key={t} className="tag-chip preview">{t}</span>
            ))}
          </div>
        )}
        <p className="subtitle" style={subtitleStyle}>{recipe.subtitle}</p>
        {hasMeta && (
        <div className="meta" style={metaStyle}>
          {recipe.servings && (
            <div className="meta-item">
              <svg className="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="currentColor" />
                <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4v1H6v-1z" fill="currentColor" />
              </svg>
              <span>Personnes :</span>
              <strong>{recipe.servings}</strong>
            </div>
          )}

          {recipe.prepTime && (
            <div className="meta-item">
              <svg className="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 8v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              <span>Préparation :</span>
              <strong>{recipe.prepTime}</strong>
            </div>
          )}

          {recipe.cookTime && (
            <div className="meta-item">
              <svg className="field-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M7 7h10M7 11h10M7 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Cuisson :</span>
              <strong>{recipe.cookTime}</strong>
            </div>
          )}
        </div>
        )}
        {/* {(recipe.createdAt || recipe.updatedAt) && (
          <div className="preview-dates" style={{marginTop: 12, fontSize: '13px', color: 'var(--text-muted)'}}>
            {recipe.createdAt && <div>📅 Créée le {new Date(recipe.createdAt).toLocaleDateString('fr-FR')}</div>}
            {recipe.updatedAt && recipe.updatedAt !== recipe.createdAt && <div>🔄 Modifiée le {new Date(recipe.updatedAt).toLocaleDateString('fr-FR')}</div>}
          </div>
        )} */}
      </header>

      <section>
        <h3 className="ing-title" style={ingredientsTitleStyle}>Ingrédients</h3>
        <table className="ingredients-table" aria-label="Ingrédients">
          <tbody>
            {(recipe.ingredients || []).map((ing, i) => (
              <tr key={i} className="ingredient-row">
                <td className="ing-desc" style={ingredientsStyle}>{ing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3 className="steps-title" style={stepsTitleStyle}>Étapes</h3>
        <table className="steps-table" aria-label="Étapes de la recette">
          <tbody>
            {(recipe.steps || []).map((s, i) => (
              <tr key={i} className="step-row">
                <td className="step-num" aria-hidden style={stepNumStyle}>{i + 1}</td>
                <td className="step-desc" style={stepsStyle}>{s}</td>
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

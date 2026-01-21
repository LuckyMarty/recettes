import React from 'react'
import toast from 'react-hot-toast'

export default function PrintSettings({ recipe, globalPrintDefaults, updatePrintField, setGlobalPrintDefaults }) {
  return (
    <section>
      <h3>🖨️ Impression / PDF</h3>
      <p className="muted-text">
        Personnalisez la mise en page de votre recette pour l'impression ou l'export PDF. 
        Ces réglages sont sauvegardés avec la recette.
      </p>

      <div className="print-settings">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div style={{fontSize:14,color:'var(--text-dark)'}}>Options globales</div>
          <div>
            <button
              type="button"
              className="btn"
              onClick={() => {
                const next = { ...(globalPrintDefaults || {}), ...(recipe.print || {}) }
                try {
                  setGlobalPrintDefaults(next)
                  toast.success("🔖 Réglages d'impression enregistrés comme défauts")
                } catch (e) {
                  console.error('Failed to save global print defaults', e)
                  toast.error("Erreur : impossible d'enregistrer les réglages")
                }
              }}
              title="Enregistrer les réglages d'impression actuels comme valeurs par défaut pour les nouvelles recettes"
            >
              💾 Enregistrer comme défaut
            </button>
          </div>
        </div>

        <div className="print-section">
          <h4 className="print-section-title">📏 Marges de la page</h4>
          <div className="print-subsection">
            <label className="inline-label">
              <span>Unité de mesure</span>
              <select
                value={recipe.print?.marginUnit ?? globalPrintDefaults?.marginUnit ?? "mm"}
                onChange={(e) => updatePrintField("marginUnit", e.target.value)}
                style={{width: 'auto', minWidth: '100px'}}
              >
                <option value="mm">Millimètres (mm)</option>
                <option value="cm">Centimètres (cm)</option>
                <option value="in">Pouces (in)</option>
              </select>
            </label>
          </div>
          <div className="row two-columns">
            <label>
              <span className="label-icon">⬆️</span> Marge haut
              <input
                type="number"
                min="0"
                step="0.5"
                value={recipe.print?.marginTop ?? globalPrintDefaults?.marginTop ?? 10}
                onChange={(e) => updatePrintField("marginTop", Number(e.target.value))}
                placeholder={`10 ${recipe.print?.marginUnit ?? globalPrintDefaults?.marginUnit ?? "mm"}`}
              />
            </label>
            <label>
              <span className="label-icon">⬇️</span> Marge bas
              <input
                type="number"
                min="0"
                step="0.5"
                value={recipe.print?.marginBottom ?? globalPrintDefaults?.marginBottom ?? 10}
                onChange={(e) => updatePrintField("marginBottom", Number(e.target.value))}
                placeholder={`10 ${recipe.print?.marginUnit ?? globalPrintDefaults?.marginUnit ?? "mm"}`}
              />
            </label>
            <label>
              <span className="label-icon">⬅️</span> Marge gauche
              <input
                type="number"
                min="0"
                step="0.5"
                value={recipe.print?.marginLeft ?? globalPrintDefaults?.marginLeft ?? 10}
                onChange={(e) => updatePrintField("marginLeft", Number(e.target.value))}
                placeholder={`10 ${recipe.print?.marginUnit ?? globalPrintDefaults?.marginUnit ?? "mm"}`}
              />
            </label>
            <label>
              <span className="label-icon">➡️</span> Marge droite
              <input
                type="number"
                min="0"
                step="0.5"
                value={recipe.print?.marginRight ?? globalPrintDefaults?.marginRight ?? 10}
                onChange={(e) => updatePrintField("marginRight", Number(e.target.value))}
                placeholder={`10 ${recipe.print?.marginUnit ?? globalPrintDefaults?.marginUnit ?? "mm"}`}
              />
            </label>
          </div>
        </div>

        <div className="print-section">
          <h4 className="print-section-title">✏️ Taille des textes</h4>
          <p className="print-hint">Ajustez la taille des polices en pixels (px) pour l'impression</p>
          
          <div className="print-subsection">
            <div className="subsection-header">En-tête de la recette</div>
            <div className="row two-columns">
              <label>
                Titre principal
                <input
                  type="number"
                  min="6"
                  max="72"
                  value={recipe.print?.titleFontSize ?? globalPrintDefaults?.titleFontSize ?? 20}
                  onChange={(e) => updatePrintField("titleFontSize", Number(e.target.value))}
                  placeholder="20 px"
                />
              </label>
              <label>
                Description
                <input
                  type="number"
                  min="6"
                  max="72"
                  value={recipe.print?.subtitleFontSize ?? globalPrintDefaults?.subtitleFontSize ?? 14}
                  onChange={(e) => updatePrintField("subtitleFontSize", Number(e.target.value))}
                  placeholder="14 px"
                />
              </label>
              <label>
                Catégories / Tags
                <input
                  type="number"
                  min="6"
                  max="72"
                  value={recipe.print?.categoriesFontSize ?? globalPrintDefaults?.categoriesFontSize ?? 12}
                  onChange={(e) => updatePrintField("categoriesFontSize", Number(e.target.value))}
                  placeholder="12 px"
                />
              </label>
              <label>
                Portions & temps
                <input
                  type="number"
                  min="6"
                  max="72"
                  value={recipe.print?.metaFontSize ?? globalPrintDefaults?.metaFontSize ?? 13}
                  onChange={(e) => updatePrintField("metaFontSize", Number(e.target.value))}
                  placeholder="13 px"
                />
              </label>
            </div>
          </div>

          <div className="print-subsection">
            <div className="subsection-header">Section Ingrédients</div>
            <div className="row two-columns">
              <label>
                Titre "Ingrédients"
                <input
                    type="number"
                    min="6"
                    max="72"
                    value={recipe.print?.ingredientsTitleFontSize ?? globalPrintDefaults?.ingredientsTitleFontSize ?? 16}
                    onChange={(e) => updatePrintField("ingredientsTitleFontSize", Number(e.target.value))}
                    placeholder="16 px"
                  />
              </label>
              <label>
                Liste des ingrédients
                <input
                  type="number"
                  min="6"
                  max="72"
                  value={recipe.print?.ingredientsBodyFontSize ?? recipe.print?.ingredientsFontSize ?? globalPrintDefaults?.ingredientsBodyFontSize ?? globalPrintDefaults?.ingredientsFontSize ?? 12}
                  onChange={(e) => updatePrintField("ingredientsBodyFontSize", Number(e.target.value))}
                  placeholder="12 px"
                />
              </label>
            </div>
          </div>

          <div className="print-subsection">
            <div className="subsection-header">Section Préparation</div>
            <div className="row two-columns">
              <label>
                Titre "Préparation"
                <input
                    type="number"
                    min="6"
                    max="72"
                    value={recipe.print?.stepsTitleFontSize ?? globalPrintDefaults?.stepsTitleFontSize ?? 16}
                    onChange={(e) => updatePrintField("stepsTitleFontSize", Number(e.target.value))}
                    placeholder="16 px"
                  />
              </label>
              <label>
                Texte des étapes
                <input
                  type="number"
                  min="6"
                  max="72"
                  value={recipe.print?.stepsBodyFontSize ?? recipe.print?.stepsFontSize ?? globalPrintDefaults?.stepsBodyFontSize ?? globalPrintDefaults?.stepsFontSize ?? 12}
                  onChange={(e) => updatePrintField("stepsBodyFontSize", Number(e.target.value))}
                  placeholder="12 px"
                />
              </label>
              <label>
                Numéro d'étape
                <input
                  type="number"
                  min="6"
                  max="72"
                  value={recipe.print?.stepNumberFontSize ?? globalPrintDefaults?.stepNumberFontSize ?? 16}
                  onChange={(e) => updatePrintField("stepNumberFontSize", Number(e.target.value))}
                  placeholder="16 px"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

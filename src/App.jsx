import React, { useRef, useState } from 'react'
import RecipeEditor from './components/RecipeEditor.jsx'
import RecipePreview from './components/RecipePreview.jsx'
import html2pdf from 'html2pdf.js'

export default function App() {
  const [showHelp, setShowHelp] = useState(false)
  const [theme, setTheme] = useState('orange') // orange, blue, green, purple, pink
  const [recipe, setRecipe] = useState({
    title: 'Ma recette',
    subtitle: 'Une délicieuse recette à partager',
    servings: '2',
    prepTime: '15 min',
    cookTime: '30 min',
    ingredients: ['200 g de farine', '2 oeufs'],
    steps: ['Mélanger les ingrédients', 'Cuire 30 minutes'],
    image: null, // data URL or null
    tags: []
  })

  const previewRef = useRef()

  function handleChange(next) {
    setRecipe((r) => ({ ...r, ...next }))
  }

  function printRecipe() {
    // Simple print — user can save as PDF from the print dialog
    window.print()
  }

  function downloadPdf() {
    const element = previewRef.current
    if (!element) return
    const opt = {
      margin: 0.5,
      filename: `${recipe.title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      // useCORS helps if images are loaded from remote URLs; data-URLs work without CORS.
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }
    // Apply temporary class so the preview uses print styling during PDF render
    element.classList.add('print-mode')
    const job = html2pdf().set(opt).from(element).save()
    // remove the class after generation (both success and error)
    if (job && job.then) {
      job.then(() => element.classList.remove('print-mode')).catch(() => element.classList.remove('print-mode'))
    } else {
      // fallback: remove after a delay
      setTimeout(() => element.classList.remove('print-mode'), 800)
    }
  }

  const themes = {
    orange: { accent: '#e67e50', light: '#fef3ed' },
    blue: { accent: '#4a90e2', light: '#e8f4fd' },
    green: { accent: '#52c41a', light: '#f0fae8' },
    purple: { accent: '#9c27b0', light: '#f3e5f5' },
    pink: { accent: '#ec407a', light: '#fce4ec' }
  }

  return (
    <div className="app-container" style={{
      '--accent': themes[theme].accent,
      '--accent-light': themes[theme].light
    }}>
      <header className="app-header">
        <h1>📝 Créateur de Recettes</h1>
        <div className="buttons">
          <div className="theme-picker">
            <label style={{fontSize: '15px', marginRight: '8px', fontWeight: '600'}}>🎨 Couleur:</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="theme-select">
              <option value="orange">🧡 Orange</option>
              <option value="blue">💙 Bleu</option>
              <option value="green">💚 Vert</option>
              <option value="purple">💜 Violet</option>
              <option value="pink">💗 Rose</option>
            </select>
          </div>
          <button className="btn" onClick={() => setShowHelp((s) => !s)} title="Afficher / Masquer l'aide">
            💡 {showHelp ? 'Masquer' : 'Aide'}
          </button>
          <button className="btn" onClick={printRecipe} title="Ouvrir la boîte d'impression">
            🖨️ Imprimer
          </button>
          <button className="btn btn-primary" onClick={downloadPdf} title="Télécharger en PDF">
            📥 Télécharger PDF
          </button>
        </div>
      </header>

      <main className="split">
        <section className="left">
          {showHelp && (
            <div className="help-panel">
              <strong>📖 Comment utiliser ce créateur de recettes ?</strong>
              <ul>
                <li className="muted-text">✍️ Remplissez votre recette à gauche, elle apparaît en direct à droite</li>
                <li className="muted-text">🔼🔽 Utilisez les flèches <strong>▲</strong> et <strong>▼</strong> pour déplacer les ingrédients et les étapes</li>
                <li className="muted-text">📥 Cliquez sur «Télécharger PDF» pour sauvegarder votre recette</li>
                <li className="muted-text">📷 Ajoutez une photo pour la voir dans votre recette</li>
              </ul>
            </div>
          )}
          <RecipeEditor recipe={recipe} onChange={handleChange} />
        </section>
        <section className="right">
          <div ref={previewRef} className="preview-wrapper">
            <RecipePreview recipe={recipe} />
          </div>
        </section>
      </main>
    </div>
  )
}

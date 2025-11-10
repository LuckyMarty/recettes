import React, { useRef, useState } from 'react'
import RecipeEditor from './components/RecipeEditor.jsx'
import RecipePreview from './components/RecipePreview.jsx'
import html2pdf from 'html2pdf.js'

export default function App() {
  const [recipe, setRecipe] = useState({
    title: 'Ma recette',
    subtitle: 'Une délicieuse recette à partager',
    servings: '2',
    prepTime: '15 min',
    cookTime: '30 min',
    ingredients: ['200 g de farine', '2 oeufs'],
    steps: ['Mélanger les ingrédients', 'Cuire 30 minutes']
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
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }
    html2pdf().set(opt).from(element).save()
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Éditeur de recette — Live Preview</h1>
        <div className="buttons">
          <button onClick={printRecipe}>Imprimer / Enregistrer en PDF</button>
          <button onClick={downloadPdf}>Télécharger PDF (auto)</button>
        </div>
      </header>

      <main className="split">
        <section className="left">
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

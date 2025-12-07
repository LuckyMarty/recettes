import React, { useEffect, useRef, useState } from 'react'
import RecipePreview from './components/RecipePreview.jsx'
import html2pdf from 'html2pdf.js'
import './styles.scss'

export default function RecipePage({ recipe: propRecipe } = {}) {
  // For now we only support rendering from a passed-in `recipe` prop.
  // This avoids calling the backend when the back office doesn't expose the API.
  const [recipe, setRecipe] = useState(propRecipe || null)
  const previewRef = useRef()

  useEffect(() => {
    setRecipe(propRecipe || null)
  }, [propRecipe])

  function downloadPdf() {
    const element = previewRef.current
    if (!element) return
    const opt = {
      margin: 10,
      filename: `${(recipe && recipe.title) ? recipe.title.replace(/\s+/g, '_') : 'recette'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    element.classList.add('print-mode')
    const job = html2pdf().set(opt).from(element).save()
    if (job && job.then) {
      job.then(() => element.classList.remove('print-mode')).catch(() => element.classList.remove('print-mode'))
    } else {
      setTimeout(() => element.classList.remove('print-mode'), 800)
    }
  }

  if (!recipe) {
    return (
      <div className="recipe-page" style={{padding:24}}>
        <h3>Aucune recette fournie</h3>
        <p className="muted-text">Cette vue attend que vous passiez la recette en prop, par exemple: <code>&lt;RecipePage recipe=&#123;recipe&#125; /&gt;</code></p>
      </div>
    )
  }

  return (
    <div className="recipe-page">
        <RecipePreview recipe={recipe} globalPrintDefaults={{}} />
    </div>
  )
}

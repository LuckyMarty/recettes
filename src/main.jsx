import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import RecipePage from './Recipe.jsx'
import './styles.scss'

const params = new URLSearchParams(window.location.search)
// detect query-based or path-based recipe URLs
const shouldRenderRecipe = params.has('recipe') || params.has('id') || params.has('recipe_id') || (() => {
  try {
    const parts = (window.location.pathname || '').split('/').filter(Boolean)
    return parts.length >= 2 && /^(recipe|recipes|r)$/i.test(parts[0])
  } catch (e) {
    return false
  }
})()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {shouldRenderRecipe ? <RecipePage /> : <App />}
  </React.StrictMode>
)

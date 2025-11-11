import React, { useRef, useState, useEffect } from 'react'
import RecipeEditor from './components/RecipeEditor.jsx'
import RecipePreview from './components/RecipePreview.jsx'
import html2pdf from 'html2pdf.js'
import Auth from './components/Auth.jsx'
import Profile from './components/Profile.jsx'
import SearchBar from './components/SearchBar.jsx'
import toast, { Toaster } from 'react-hot-toast'

export default function App() {
  const [showHelp, setShowHelp] = useState(false)
  const [theme, setTheme] = useState('orange') // orange, blue, green, purple, pink
  const themes = {
    orange: { accent: '#e67e50', light: '#fef3ed' },
    blue: { accent: '#4a90e2', light: '#e8f4fd' },
    green: { accent: '#52c41a', light: '#f0fae8' },
    purple: { accent: '#9c27b0', light: '#f3e5f5' },
    pink: { accent: '#ec407a', light: '#fce4ec' }
  }
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingRecipes, setLoadingRecipes] = useState(false)
  const [allRecipes, setAllRecipes] = useState([]) // Store all recipes separately
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { id, title } or null
  const [recipe, setRecipe] = useState({
    title: 'Ma recette',
    subtitle: 'Une délicieuse recette à partager',
    servings: '2',
    prepTime: '15 min',
    cookTime: '30 min',
    ingredients: ['200 g de farine', '2 oeufs'],
    steps: ['Mélanger les ingrédients', 'Cuire 30 minutes'],
    image: null, // data URL or null
    tags: [],
    createdAt: null,
    updatedAt: null
  })

  const previewRef = useRef()
  const [searchResults, setSearchResults] = useState([])
  useEffect(() => {
    // Check if user is logged in (stored in localStorage for session persistence)
    const curId = localStorage.getItem('recettes_current')
    if (curId && !currentUser) {
      // Only set if not already set
      setCurrentUser({ id: parseInt(curId) })
    }
  }, []) // Remove currentUser dependency to prevent infinite loop

  // Load recipes when user logs in
  useEffect(() => {
    if (currentUser) {
      loadUserRecipes()
    } else {
      setSearchResults([])
      setAllRecipes([])
      setShowProfile(false)
    }
  }, [currentUser]) // Removed loadingRecipes to prevent infinite loop

  // API functions
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3002/api'

  async function loadUserRecipes() {
    if (loadingRecipes) return // Prevent multiple calls
    setLoadingRecipes(true)
    try {
      const response = await fetch(`${API_BASE}/users/${currentUser.id}/recipes`)
      if (response.ok) {
        const recipes = await response.json()
        // Map snake_case to camelCase
        const mappedRecipes = recipes.map(r => ({
          ...r,
          prepTime: r.prep_time,
          cookTime: r.cook_time,
          createdAt: r.created_at,
          updatedAt: r.updated_at
        }))
        setUsers([{ ...currentUser, recipes: mappedRecipes }])
        setAllRecipes(mappedRecipes)
        setSearchResults(mappedRecipes)
        setShowProfile(true)
      }
    } catch (error) {
      console.error('Failed to load recipes:', error)
    } finally {
      setLoadingRecipes(false)
    }
  }

  async function apiLogin(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    return data
  }

  async function apiRegister(name, email, password) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed')
    }

    return data
  }

  async function apiCreateRecipe(recipe) {
    const response = await fetch(`${API_BASE}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    })

    if (!response.ok) {
      throw new Error('Failed to create recipe')
    }

    return response.json()
  }

  async function apiUpdateRecipe(id, recipe) {
    const response = await fetch(`${API_BASE}/recipes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    })

    if (!response.ok) {
      throw new Error('Failed to update recipe')
    }

    return response.json()
  }

  async function apiDeleteRecipe(id) {
    const response = await fetch(`${API_BASE}/recipes/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete recipe')
    }

    return response.json()
  }

  // run search when query changes
  useEffect(() => {
    if (!searchQuery) return setSearchResults(allRecipes)
    const q = searchQuery.toLowerCase()
    const results = allRecipes.filter((r) => {
      return (
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.subtitle && r.subtitle.toLowerCase().includes(q)) ||
        (r.ingredients && r.ingredients.join(' ').toLowerCase().includes(q)) ||
        (r.steps && r.steps.join(' ').toLowerCase().includes(q)) ||
        (r.tags && r.tags.join(' ').toLowerCase().includes(q))
      )
    })
    setSearchResults(results)
  }, [searchQuery, allRecipes])

  // Do not return early — always call hooks in the same order.
  // We render the auth/full-landing conditionally inside the main JSX below.

  function handleChange(next) {
    setRecipe((r) => ({ ...r, ...next }))
  }

  function persistUsers(next) {
    // No longer needed with API - users are stored in database
    setUsers(next)
  }

  function handleLogin({ email, password }) {
    apiLogin(email, password)
      .then(user => {
        setCurrentUser(user)
        localStorage.setItem('recettes_current', String(user.id))
        setShowAuth(false)
        setShowProfile(true)
      })
      .catch(error => {
        toast.error(`Erreur de connexion: ${error.message}`)
        console.error('Login error:', error)
      })
  }

  function handleSignup({ name, email, password }) {
    apiRegister(name, email, password)
      .then(user => {
        setCurrentUser(user)
        localStorage.setItem('recettes_current', String(user.id))
        setShowAuth(false)
        setShowProfile(true)
      })
      .catch(error => {
        toast.error(`Erreur d'inscription: ${error.message}`)
        console.error('Signup error:', error)
      })
  }

  function handleLogout() {
    setCurrentUser(null)
    localStorage.removeItem('recettes_current')
  }

  function saveCurrentRecipe() {
    if (!currentUser || !recipe.title.trim()) return

    const recipeToSave = {
      ...recipe,
      user_id: currentUser.id,
      prep_time: recipe.prepTime,
      cook_time: recipe.cookTime,
      updated_at: new Date().toISOString()
    }
    // Remove the camelCase versions
    delete recipeToSave.prepTime
    delete recipeToSave.cookTime

    if (recipe.id) {
      // Update existing recipe
      apiUpdateRecipe(recipe.id, recipeToSave)
        .then(() => {
          loadUserRecipes() // Reload recipes
          setShowProfile(true) // Switch to profile view
          toast.success('Recette mise à jour avec succès !')
        })
        .catch(error => {
          console.error('Failed to update recipe:', error)
          toast.error('Erreur lors de la sauvegarde')
        })
    } else {
      // Create new recipe
      recipeToSave.created_at = new Date().toISOString()
      apiCreateRecipe(recipeToSave)
        .then(result => {
          setRecipe({ ...recipe, id: result.id })
          loadUserRecipes() // Reload recipes
          setShowProfile(true) // Switch to profile view
          toast.success('Recette créée avec succès !')
        })
        .catch(error => {
          console.error('Failed to create recipe:', error)
          toast.error('Erreur lors de la sauvegarde')
        })
    }
  }

  function deleteRecipe(id) {
    if (!currentUser) return
    // Find the recipe title for confirmation
    const recipeToDelete = searchResults.find(r => r.id === id)
    if (recipeToDelete) {
      setDeleteConfirm({ id, title: recipeToDelete.title })
    }
  }

  function confirmDelete() {
    if (!deleteConfirm) return

    const { id } = deleteConfirm
    setDeleteConfirm(null) // Close modal

    toast.promise(
      apiDeleteRecipe(id),
      {
        loading: 'Suppression en cours...',
        success: 'Recette supprimée avec succès !',
        error: 'Erreur lors de la suppression'
      }
    ).then(() => {
      loadUserRecipes() // Reload recipes
      // Clear editor if the deleted recipe was currently loaded
      if (recipe.id === id) {
        setRecipe({
          title: 'Ma recette',
          subtitle: 'Une délicieuse recette à partager',
          servings: '2',
          prepTime: '15 min',
          cookTime: '30 min',
          ingredients: ['200 g de farine', '2 oeufs'],
          steps: ['Mélanger les ingrédients', 'Cuire 30 minutes'],
          image: null,
          tags: [],
          createdAt: null,
          updatedAt: null
        })
      }
    }).catch(error => {
      console.error('Failed to delete recipe:', error)
    })
  }

  function loadRecipe(r) {
    if (!r) return
    setRecipe(r)
    setShowProfile(false)
  }

  function createNew() {
    setRecipe({ title: '', subtitle: '', servings: '', prepTime: '', cookTime: '', ingredients: [], steps: [], image: null, tags: [], createdAt: null, updatedAt: null })
    setShowProfile(false)
  }

  function printRecipe(recipe = null) {
    if (recipe) {
      // If a specific recipe is provided, load it first
      setRecipe(recipe)
      setShowProfile(false)
      // Wait a bit for the UI to update, then print
      setTimeout(() => window.print(), 100)
    } else {
      // Print current recipe
      window.print()
    }
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


  return (
    <div className="app-container" style={{
      '--accent': themes[theme].accent,
      '--accent-light': themes[theme].light
    }}>
      {!currentUser ? (
        <main style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 88px)'}}>
          <Auth onLogin={handleLogin} onSignup={handleSignup} onClose={() => {}} />
        </main>
      ) : (
        <>
          <header className="app-header">
            {showProfile && <h1>📝 Créateur de Recettes</h1>}
            {!showProfile && (
              <div className="edit-header">
                <button className="btn btn-ghost" onClick={() => setShowProfile(true)} title="Retour à la collection">
                  ← Retour
                </button>
                <div className="edit-controls">
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
                  <button className="btn" onClick={printRecipe} title="Ouvrir la boîte d'impression">🖨️ Imprimer</button>
                  <button className="btn" onClick={downloadPdf} title="Télécharger en PDF">📥 Télécharger PDF</button>
                  <button className="btn btn-primary" onClick={saveCurrentRecipe} title="Enregistrer la recette">💾 Enregistrer</button>
                </div>
              </div>
            )}
            {showProfile && (
              <>
                <div className="header-search-row" style={{display:'flex',alignItems:'center',gap:12}}>
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
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
                  {currentUser ? (
                    <>
                      <button className="btn" onClick={handleLogout}>Se déconnecter</button>
                    </>
                  ) : (
                    <button className="btn" onClick={() => setShowAuth(true)}>Se connecter</button>
                  )}
                </div>
              </>
            )}
          </header>

          {/* Mobile search - full width below header */}
          {showProfile && (
            <div className="mobile-search">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          )}

          <main className={showProfile ? "full-profile" : "split"}>
            <section className="left" style={showProfile ? { width: '100%' } : {}}>
              {showProfile ? (
                <Profile
                  user={currentUser}
                  searchResults={searchResults}
                  searchQuery={searchQuery}
                  onLogout={handleLogout}
                  onLoadRecipe={loadRecipe}
                  onDeleteRecipe={deleteRecipe}
                  onCreateNew={createNew}
                  onPrintRecipe={printRecipe}
                  onSaveRecipe={saveCurrentRecipe}
                  onUpdateUser={(u) => { const next = users.map((x) => x.id === u.id ? u : x); persistUsers(next); setCurrentUser(u) }}
                />
              ) : (
                <>
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
                </>
              )}
            </section>
            {!showProfile && (
              <section className="right">
                <div ref={previewRef} className="preview-wrapper">
                  <RecipePreview recipe={recipe} />
                </div>
              </section>
            )}
          </main>
        </>
      )}
      {showAuth && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.3)'}}>
          <Auth onLogin={handleLogin} onSignup={handleSignup} onClose={() => setShowAuth(false)} />
        </div>
      )}
      {deleteConfirm && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.3)',zIndex:1000}}>
          <div style={{background:'white',padding:'20px',borderRadius:'8px',maxWidth:'400px',width:'90%'}}>
            <h3 style={{margin:'0 0 16px 0',color:'#333'}}>Confirmer la suppression</h3>
            <p style={{margin:'0 0 20px 0',color:'#666'}}>
              Êtes-vous sûr de vouloir supprimer la recette "<strong>{deleteConfirm.title}</strong>" ?
              <br />
              Cette action est irréversible.
            </p>
            <div style={{display:'flex',gap:'12px',justifyContent:'flex-end'}}>
              <button 
                onClick={() => setDeleteConfirm(null)}
                style={{padding:'8px 16px',border:'1px solid #ddd',borderRadius:'4px',background:'white',cursor:'pointer'}}
              >
                Annuler
              </button>
              <button 
                onClick={confirmDelete}
                style={{padding:'8px 16px',border:'none',borderRadius:'4px',background:'#dc3545',color:'white',cursor:'pointer'}}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster position="bottom-right" />
    </div>
  )
}

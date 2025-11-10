import React, { useRef, useState, useEffect } from 'react'
import RecipeEditor from './components/RecipeEditor.jsx'
import RecipePreview from './components/RecipePreview.jsx'
import html2pdf from 'html2pdf.js'
import Auth from './components/Auth.jsx'
import Profile from './components/Profile.jsx'
import SearchBar from './components/SearchBar.jsx'

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
  const [searchResults, setSearchResults] = useState([])
  useEffect(() => {
    // load saved users from localStorage
    try {
      const raw = localStorage.getItem('recettes_users')
      const parsed = raw ? JSON.parse(raw) : []
      setUsers(parsed)
      const curId = localStorage.getItem('recettes_current')
      if (curId) {
        const u = parsed.find((x) => String(x.id) === String(curId))
        if (u) setCurrentUser(u)
      }
    } catch (err) {
      console.warn('Failed to load users', err)
    }
  }, [])

  // when app loads and we found a current user, show their collection first
  useEffect(() => {
    if (currentUser) setShowProfile(true)
  }, [currentUser])

  // run search when query changes
  useEffect(() => {
    if (!currentUser) return setSearchResults([])
    if (!searchQuery) return setSearchResults(currentUser.recipes || [])
    const q = searchQuery.toLowerCase()
    const results = (currentUser.recipes || []).filter((r) => {
      return (
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.subtitle && r.subtitle.toLowerCase().includes(q)) ||
        (r.ingredients && r.ingredients.join(' ').toLowerCase().includes(q)) ||
        (r.steps && r.steps.join(' ').toLowerCase().includes(q)) ||
        (r.tags && r.tags.join(' ').toLowerCase().includes(q))
      )
    })
    setSearchResults(results)
  }, [searchQuery, currentUser])

  // Do not return early — always call hooks in the same order.
  // We render the auth/full-landing conditionally inside the main JSX below.

  function handleChange(next) {
    setRecipe((r) => ({ ...r, ...next }))
  }

  function persistUsers(next) {
    setUsers(next)
    try { localStorage.setItem('recettes_users', JSON.stringify(next)) } catch (e) {}
  }

  function handleLogin({ email, password }) {
    const u = users.find((x) => x.email === email && x.password === password)
    if (!u) {
      alert('Utilisateur introuvable ou mot de passe incorrect')
      return
    }
    setCurrentUser(u)
    localStorage.setItem('recettes_current', String(u.id))
    setShowAuth(false)
    setShowProfile(true)
  }

  function handleSignup({ name, email, password }) {
    if (users.find((x) => x.email === email)) {
      alert('Un compte existe déjà pour cet email')
      return
    }
    const u = { id: Date.now(), name, email, password, recipes: [], folders: {} }
    const next = [...users, u]
    persistUsers(next)
    setCurrentUser(u)
    localStorage.setItem('recettes_current', String(u.id))
    setShowAuth(false)
    setShowProfile(true)
  }

  function handleLogout() {
    setCurrentUser(null)
    localStorage.removeItem('recettes_current')
  }

  function saveCurrentRecipe() {
    if (!currentUser) { setShowAuth(true); return }
    const recipes = currentUser.recipes || []
    const r = { ...recipe }
    if (r.id) {
      const nextRecipes = recipes.map((x) => x.id === r.id ? r : x)
      const updated = { ...currentUser, recipes: nextRecipes }
      const nextUsers = users.map((u) => u.id === currentUser.id ? updated : u)
      persistUsers(nextUsers)
      setCurrentUser(updated)
      alert('Recette mise à jour')
    } else {
      r.id = Date.now()
      const nextRecipes = [...recipes, r]
      const updated = { ...currentUser, recipes: nextRecipes }
      const nextUsers = users.map((u) => u.id === currentUser.id ? updated : u)
      persistUsers(nextUsers)
      setCurrentUser(updated)
      alert('Recette enregistrée')
    }
  }

  function deleteRecipe(id) {
    if (!currentUser) return
    if (!confirm('Supprimer cette recette ?')) return
    const nextRecipes = (currentUser.recipes || []).filter((r) => r.id !== id)
    const updated = { ...currentUser, recipes: nextRecipes }
    const nextUsers = users.map((u) => u.id === currentUser.id ? updated : u)
    persistUsers(nextUsers)
    setCurrentUser(updated)
    // if the currently loaded recipe was deleted, clear editor
    if (recipe.id === id) setRecipe({ title: '', subtitle: '', servings: '', prepTime: '', cookTime: '', ingredients: [], steps: [], image: null, tags: [] })
  }

  function loadRecipe(r) {
    if (!r) return
    setRecipe(r)
    setShowProfile(false)
  }

  function createNew() {
    setRecipe({ title: '', subtitle: '', servings: '', prepTime: '', cookTime: '', ingredients: [], steps: [], image: null, tags: [] })
    setShowProfile(false)
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
            <h1>📝 Créateur de Recettes</h1>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              {showProfile && <SearchBar value={searchQuery} onChange={setSearchQuery} />}
              <div className="buttons">
                {!showProfile && (
                  <>
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
                    <button className="btn btn-primary" onClick={downloadPdf} title="Télécharger en PDF">📥 Télécharger PDF</button>
                    <button className="btn" onClick={saveCurrentRecipe} title="Enregistrer la recette">💾 Enregistrer</button>
                  </>
                )}
                {showProfile && currentUser ? (
                  <>
                    <button className="btn" onClick={() => setShowProfile((s) => !s)}>{currentUser.name || currentUser.email}</button>
                    <button className="btn" onClick={handleLogout}>Se déconnecter</button>
                  </>
                ) : showProfile ? (
                  <button className="btn" onClick={() => setShowAuth(true)}>Se connecter</button>
                ) : null}
              </div>
            </div>
          </header>

          <main className={showProfile ? "full-profile" : "split"}>
            <section className="left" style={showProfile ? { width: '100%' } : {}}>
              {showProfile ? (
                <Profile
                  user={currentUser}
                  onLogout={handleLogout}
                  onLoadRecipe={loadRecipe}
                  onDeleteRecipe={deleteRecipe}
                  onCreateNew={createNew}
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
    </div>
  )
}

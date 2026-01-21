import React from 'react'

export default function Header(props) {
  const {
    showProfile,
    standaloneRecipe,
    theme,
    setTheme,
    showHelp,
    setShowHelp,
    printRecipe,
    downloadPdf,
    saveCurrentRecipe,
    isGuest,
    setShowAuth,
    handleLogout,
    currentUser,
    setShowProfile,
    setIsGuest
  } = props

  return (
    <header className="app-header">
      {showProfile && <h1>📝 Créateur de Recettes</h1>}
      {!showProfile && (
        <div className="edit-header">
          <button className="btn btn-ghost" onClick={() => {
            if (standaloneRecipe) {
              try {
                const params = new URLSearchParams(window.location.search)
                params.delete('view')
                const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname
                window.history.replaceState({}, '', newUrl)
                sessionStorage.removeItem('standaloneRecipe')
                if (standaloneRecipe && standaloneRecipe.id) sessionStorage.removeItem(`standaloneRecipe_${standaloneRecipe.id}`)
              } catch (e) {
                // ignore
              }
              setShowProfile(true)
              return
            }
            if (isGuest) {
              setIsGuest(false)
            } else {
              setShowProfile(true)
            }
          }} title={isGuest ? "Retour à l'accueil" : "Retour à la collection"}>
            ← Retour
          </button>
          {!standaloneRecipe && (
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
              <button className="btn" onClick={() => printRecipe()} title="Ouvrir la boîte d'impression">🖨️ Imprimer</button>
              <button className="btn" onClick={downloadPdf} title="Télécharger en PDF">📥 Télécharger PDF</button>
              <button 
                className="btn btn-primary" 
                data-tutorial="save"
                onClick={saveCurrentRecipe} 
                title={isGuest ? "Connectez-vous pour sauvegarder" : "Enregistrer la recette"}
                disabled={isGuest}
              >
                💾 {isGuest ? 'Connexion requise' : 'Enregistrer'}
              </button>
            </div>
          )}
        </div>
      )}

      {showProfile && (
        <>
          <div className="header-search-row" style={{display:'flex',alignItems:'center',gap:12}} />
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
            {currentUser && !isGuest ? (
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
  )
}

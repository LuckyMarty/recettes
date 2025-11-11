import React, { useState } from 'react'

export default function Profile({ user, searchResults, searchQuery, onLogout, onLoadRecipe, onDeleteRecipe, onCreateNew, onPrintRecipe, onSaveRecipe, onUpdateUser }) {
  const [folderName, setFolderName] = useState('')
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [sortBy, setSortBy] = useState('created-desc') // 'created-desc', 'created-asc', 'updated-desc', 'updated-asc', 'title-asc', 'title-desc'

  if (!user) return null

  // Always use searchResults - it contains all recipes when not searching
  const recipes = searchResults
  const folders = user.folders || {}

  // Sort recipes based on sortBy
  const sortedRecipes = [...recipes].sort((a, b) => {
    switch (sortBy) {
      case 'title-asc':
        return (a.title || '').localeCompare(b.title || '')
      case 'title-desc':
        return (b.title || '').localeCompare(a.title || '')
      case 'created-asc':
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
      case 'created-desc':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      case 'updated-asc':
        return new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime()
      case 'updated-desc':
      default:
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    }
  })

  function createFolder() {
    if (!folderName.trim()) return
    const next = { ...(user.folders || {}) }
    if (!next[folderName]) next[folderName] = []
    onUpdateUser({ ...user, folders: next })
    setFolderName('')
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-welcome">
          <div className="profile-avatar">👤</div>
          <div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-subtitle">{sortedRecipes.length} recette{sortedRecipes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button className="btn btn-primary btn-large" onClick={onCreateNew}>
          ✨ Nouvelle recette
        </button>
      </div>

      {sortedRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍳</div>
          <h3>Commencez votre collection</h3>
          <p className="muted-text">Créez votre première recette et partagez vos créations culinaires</p>
          <button className="btn btn-primary" onClick={onCreateNew}>➕ Créer ma première recette</button>
        </div>
      ) : (
        <>
          <div className="profile-section">
            <div className="section-header">
              <div className="section-title-group">
                <h3 className="section-title">
                  {searchQuery ? `Résultats pour "${searchQuery}"` : 'Mes recettes'}
                </h3>
                <span className="recipe-count">{sortedRecipes.length}</span>
              </div>
              <div className="sort-controls">
                <label>
                  Trier par
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="theme-select"
                  >
                    <option value="updated-desc">Plus récent</option>
                    <option value="created-desc">Créé récemment</option>
                    <option value="title-asc">A-Z</option>
                    <option value="title-desc">Z-A</option>
                    <option value="updated-asc">Plus ancien</option>
                    <option value="created-asc">Créé il y a longtemps</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="recipes-grid">
              {sortedRecipes.map((r) => (
                <div key={r.id} className="recipe-card-item">
                  {r.image && <img src={r.image} alt={r.title} className="recipe-card-thumb" />}
                  <div className="recipe-card-content">
                    <h4 className="recipe-card-title">{r.title || 'Sans titre'}</h4>
                    {r.subtitle && <p className="recipe-card-subtitle">{r.subtitle}</p>}
                    {r.tags && r.tags.length > 0 && (
                      <div className="recipe-card-tags">
                        {r.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="mini-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    {(r.createdAt || r.updatedAt) && (
                      <div className="recipe-card-dates">
                        {r.createdAt && <span className="date-item">📅 Créée: {new Date(r.createdAt).toLocaleDateString('fr-FR')}</span>}
                        {r.updatedAt && r.updatedAt !== r.createdAt && <span className="date-item">🔄 Modifiée: {new Date(r.updatedAt).toLocaleDateString('fr-FR')}</span>}
                      </div>
                    )}
                  </div>
                  <div className="recipe-card-actions">
                    <button className="btn small btn-primary" onClick={() => onLoadRecipe(r)}>
                      ✏️ Modifier
                    </button>
                    <button className="btn small btn-secondary" onClick={() => onPrintRecipe(r)}>
                      🖨️ Imprimer
                    </button>
                    <button className="btn small btn-ghost" onClick={() => onDeleteRecipe(r.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {Object.keys(folders).length > 0 && (
            <div className="profile-section">
              <h3 className="section-title">📁 Dossiers</h3>
              <div className="folders-grid">
                {Object.entries(folders).map(([name, ids]) => (
                  <div key={name} className="folder-card">
                    <div className="folder-header">
                      <span className="folder-icon">📁</span>
                      <h4 className="folder-name">{name}</h4>
                      <span className="folder-count">{ids.length}</span>
                    </div>
                    <div className="folder-recipes">
                      {ids.slice(0, 3).map((id) => {
                        const r = recipes.find((x) => x.id === id)
                        if (!r) return null
                        return (
                          <div key={id} className="folder-recipe-item" onClick={() => onLoadRecipe(r)}>
                            <span className="folder-recipe-title">{r.title || 'Sans titre'}</span>
                          </div>
                        )
                      })}
                      {ids.length > 3 && <span className="muted-text">+{ids.length - 3} de plus</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

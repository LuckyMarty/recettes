import React, { useState } from 'react'

export default function Profile({ user, onLogout, onLoadRecipe, onDeleteRecipe, onCreateNew, onSaveRecipe, onUpdateUser }) {
  const [folderName, setFolderName] = useState('')
  const [selectedFolder, setSelectedFolder] = useState(null)

  if (!user) return null

  const recipes = user.recipes || []
  const folders = user.folders || {}

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
            <h2 className="profile-name">{user.name || user.email}</h2>
            <p className="profile-subtitle">{recipes.length} recette{recipes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button className="btn btn-primary btn-large" onClick={onCreateNew}>
          ✨ Nouvelle recette
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">�</div>
          <h3>Commencez votre collection</h3>
          <p className="muted-text">Créez votre première recette et partagez vos créations culinaires</p>
          <button className="btn btn-primary" onClick={onCreateNew}>➕ Créer ma première recette</button>
        </div>
      ) : (
        <>
          <div className="profile-section">
            <div className="section-header">
              <h3 className="section-title">📄 Mes recettes</h3>
              <span className="recipe-count">{recipes.length}</span>
            </div>
            <div className="recipes-grid">
              {recipes.map((r) => (
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
                  </div>
                  <div className="recipe-card-actions">
                    <button className="btn small btn-primary" onClick={() => onLoadRecipe(r)}>
                      ✏️ Éditer
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

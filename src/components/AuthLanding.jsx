import React from 'react'
import Auth from './Auth.jsx'

export default function AuthLanding({ showAuth, setShowAuth, setIsGuest, setRecipe, handleLogin, handleSignup }) {
  return (
    <main style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 88px)'}}>
      <div style={{textAlign: 'center', maxWidth: '400px', padding: '20px'}}>
        <h1 style={{fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent)'}}>📝 Créateur de Recettes</h1>
        <p style={{marginBottom: '2rem', color: '#666', fontSize: '1.1rem'}}>
          Créez, sauvegardez et partagez vos meilleures recettes
        </p>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          <button 
            className="btn btn-primary" 
            style={{padding: '12px 24px', fontSize: '1.1rem'}}
            onClick={() => setShowAuth(true)}
          >
            🔐 Se connecter / S'inscrire
          </button>
          
          <button 
            className="btn btn-secondary" 
            style={{padding: '12px 24px', fontSize: '1.1rem'}}
            onClick={() => {
              setIsGuest(true)
              setRecipe({ title: '', subtitle: '', servings: '', prepTime: '', cookTime: '', ingredients: [], steps: [], image: null, tags: [], createdAt: null, updatedAt: null })
            }}
          >
            🚀 Utiliser sans compte
          </button>
        </div>
        
        <p style={{marginTop: '2rem', fontSize: '0.9rem', color: '#888'}}>
          En mode invité, vos recettes ne seront pas sauvegardées
        </p>
      </div>

      {showAuth && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.3)'}}>
          <Auth onLogin={handleLogin} onSignup={handleSignup} onClose={() => setShowAuth(false)} />
        </div>
      )}
    </main>
  )
}

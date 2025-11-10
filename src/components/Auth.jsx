import React, { useState } from 'react'

export default function Auth({ onLogin, onSignup, onClose }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function submit(e) {
    e.preventDefault()
    if (mode === 'login') {
      onLogin({ email, password })
    } else {
      onSignup({ name, email, password })
    }
  }

  return (
    <div className="auth-panel">
      <div className="auth-icon">{mode === 'login' ? '🔐' : '🆕'}</div>
      <h2 className="auth-title">{mode === 'login' ? 'Bienvenue' : 'Créer un compte'}</h2>
      <p className="auth-subtitle">{mode === 'login' ? 'Connectez-vous pour accéder à vos recettes' : 'Commencez à créer vos recettes'}</p>
      
      <form onSubmit={submit} className="auth-form">
        {mode === 'signup' && (
          <div className="form-group">
            <label htmlFor="name">Nom</label>
            <input 
              id="name"
              type="text"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ex: Marie"
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="moi@exemple.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            required
            minLength="6"
          />
        </div>
        
        <button className="btn btn-primary btn-block" type="submit">
          {mode === 'login' ? '🔓 Se connecter' : "✨ S'inscrire"}
        </button>
      </form>
      
      <div className="auth-switch">
        {mode === 'login' ? (
          <span>Pas encore de compte ? <button className="link-btn" onClick={() => setMode('signup')}>Créer un compte</button></span>
        ) : (
          <span>Déjà inscrit ? <button className="link-btn" onClick={() => setMode('login')}>Se connecter</button></span>
        )}
      </div>
    </div>
  )
}

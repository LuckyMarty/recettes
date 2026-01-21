import { useEffect, useState } from 'react'

export default function useAuth(api = {}) {
  const { apiLogin, apiRegister } = api
  const [currentUser, setCurrentUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('recettes_user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setCurrentUser(parsed)
        return
      } catch (e) {
        console.warn('Failed to parse stored user:', e)
        localStorage.removeItem('recettes_user')
      }
    }

    const curId = localStorage.getItem('recettes_current')
    if (curId && !currentUser) {
      setCurrentUser({ id: parseInt(curId) })
    }
  }, [])

  function handleLogin({ email, password }) {
    if (!apiLogin) return Promise.reject(new Error('apiLogin not available'))
    return apiLogin(email, password).then(user => {
      setCurrentUser(user)
      localStorage.setItem('recettes_current', String(user.id))
      localStorage.setItem('recettes_user', JSON.stringify(user))
      setShowAuth(false)
      setIsGuest(false)
      return user
    })
  }

  function handleSignup({ name, email, password }) {
    if (!apiRegister) return Promise.reject(new Error('apiRegister not available'))
    return apiRegister(name, email, password).then(user => {
      setCurrentUser(user)
      localStorage.setItem('recettes_current', String(user.id))
      localStorage.setItem('recettes_user', JSON.stringify(user))
      setShowAuth(false)
      setIsGuest(false)
      return user
    })
  }

  function handleLogout() {
    setCurrentUser(null)
    localStorage.removeItem('recettes_current')
    localStorage.removeItem('recettes_user')
    setIsGuest(false)
  }

  return {
    currentUser,
    setCurrentUser,
    showAuth,
    setShowAuth,
    isGuest,
    setIsGuest,
    handleLogin,
    handleSignup,
    handleLogout
  }
}

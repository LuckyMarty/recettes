import { useCallback } from 'react'

export default function useApi() {
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3002/api'

  const apiLogin = useCallback(async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Login failed')
    return data
  }, [API_BASE])

  const apiRegister = useCallback(async (name, email, password) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Registration failed')
    return data
  }, [API_BASE])

  const apiCreateRecipe = useCallback(async (recipe) => {
    const response = await fetch(`${API_BASE}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    })
    if (!response.ok) throw new Error('Failed to create recipe')
    return response.json()
  }, [API_BASE])

  const apiUpdateRecipe = useCallback(async (id, recipe) => {
    const response = await fetch(`${API_BASE}/recipes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    })
    if (!response.ok) throw new Error('Failed to update recipe')
    return response.json()
  }, [API_BASE])

  const apiDeleteRecipe = useCallback(async (id) => {
    const response = await fetch(`${API_BASE}/recipes/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete recipe')
    return response.json()
  }, [API_BASE])

  const apiGetUser = useCallback(async (id) => {
    const response = await fetch(`${API_BASE}/users/${id}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch user')
    return data
  }, [API_BASE])

  const apiGetUserRecipes = useCallback(async (userId) => {
    const response = await fetch(`${API_BASE}/users/${userId}/recipes`)
    if (!response.ok) throw new Error('Failed to fetch user recipes')
    return response.json()
  }, [API_BASE])

  return {
    apiLogin,
    apiRegister,
    apiCreateRecipe,
    apiUpdateRecipe,
    apiDeleteRecipe,
    apiGetUser,
    apiGetUserRecipes,
    API_BASE
  }
}

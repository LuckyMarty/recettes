import { useEffect, useState, useCallback } from 'react'

export default function useStandaloneRecipe(allRecipes = []) {
  const [standaloneRecipe, setStandaloneRecipe] = useState(null)

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const viewId = params.get('view')
      if (viewId) {
        const found = allRecipes.find(r => String(r.id) === String(viewId))
        if (found) {
          setStandaloneRecipe(found)
          return
        }
        const rawById = sessionStorage.getItem(`standaloneRecipe_${viewId}`)
        const rawGeneric = sessionStorage.getItem('standaloneRecipe')
        const raw = rawById || rawGeneric
        if (raw) {
          const parsed = JSON.parse(raw)
          setStandaloneRecipe(parsed)
        }
      } else {
        const raw = sessionStorage.getItem('standaloneRecipe')
        if (raw) {
          const parsed = JSON.parse(raw)
          setStandaloneRecipe(parsed)
          const id = parsed && parsed.id ? String(parsed.id) : `temp_${Date.now()}`
          const p = new URLSearchParams(window.location.search)
          p.set('view', id)
          window.history.replaceState({}, '', `${window.location.pathname}?${p.toString()}`)
        }
      }
    } catch (e) {
      // ignore
    }
  }, [allRecipes])

  const openStandaloneRecipe = useCallback((r) => {
    try {
      const id = r && r.id ? String(r.id) : `temp_${Date.now()}`
      sessionStorage.setItem('standaloneRecipe', JSON.stringify(r))
      if (r && r.id) sessionStorage.setItem(`standaloneRecipe_${id}`, JSON.stringify(r))
      const params = new URLSearchParams(window.location.search)
      params.set('view', id)
      window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
    } catch (e) {
      // ignore
    }
    setStandaloneRecipe(r)
  }, [])

  return { standaloneRecipe, setStandaloneRecipe, openStandaloneRecipe }
}

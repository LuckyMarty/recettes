import React, { useRef, useState, useEffect } from 'react'
import AuthGate from './components/AuthGate.jsx'
import AppModals from './components/AppModals.jsx'
import html2pdf from 'html2pdf.js'
import toast from 'react-hot-toast'
import { useApi, useLocalStorage, useStandaloneRecipe, useTheme, useAuth } from './hooks'

export default function App() {
  const [showHelp, setShowHelp] = useState(false)
  const { theme, setTheme, themes } = useTheme('orange')
  const [users, setUsers] = useState([])
  const { apiLogin, apiRegister, apiCreateRecipe, apiUpdateRecipe, apiDeleteRecipe, apiGetUser, apiGetUserRecipes, API_BASE } = useApi()
  const auth = useAuth({ apiLogin, apiRegister })
  const [showProfile, setShowProfile] = useState(false)
  const [standaloneRecipe, setStandaloneRecipe] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingRecipes, setLoadingRecipes] = useState(false)
  const [allRecipes, setAllRecipes] = useState([]) // Store all recipes separately

  // Standalone recipe URL/session handling via hook
  const { standaloneRecipe: hookStandaloneRecipe, setStandaloneRecipe: setHookStandaloneRecipe, openStandaloneRecipe: hookOpenStandaloneRecipe } = useStandaloneRecipe(allRecipes)
  // Mirror hook value into local state for backward compatibility
  useEffect(() => { setStandaloneRecipe(hookStandaloneRecipe); if (hookStandaloneRecipe) setShowProfile(false) }, [hookStandaloneRecipe])
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { id, title } or null
  const [originalRecipe, setOriginalRecipe] = useState(null) // Track original recipe for unsaved changes detection
  const [showBackConfirm, setShowBackConfirm] = useState(false) // Show confirmation when clicking back with unsaved changes
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
  // Global print defaults persisted to localStorage via hook
  const [globalPrintDefaults, setGlobalPrintDefaults] = useLocalStorage('recettes_print_defaults', {})

  const previewRef = useRef()
  const [searchResults, setSearchResults] = useState([])
  

  // Load recipes when user logs in
  useEffect(() => {
    if (auth.currentUser && !auth.isGuest) {
      loadUserRecipes()
    } else {
      setSearchResults([])
      setAllRecipes([])
      setShowProfile(false)
    }
  }, [auth.currentUser, auth.isGuest]) // Removed loadingRecipes to prevent infinite loop

  // API functions are provided by useApi() hook (apiLogin, apiRegister, apiCreateRecipe, ...)
  async function loadUserRecipes() {
    if (loadingRecipes) return // Prevent multiple calls
    setLoadingRecipes(true)
    try {
      const recipes = await apiGetUserRecipes(auth.currentUser.id)
      // Map snake_case to camelCase
      const mappedRecipes = recipes.map(r => ({
        ...r,
        prepTime: r.prep_time,
        cookTime: r.cook_time,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
        steps: Array.isArray(r.steps) ? r.steps : [],
        tags: Array.isArray(r.tags) ? r.tags : []
      }))

      setUsers([{ ...auth.currentUser, recipes: mappedRecipes }])
      setAllRecipes(mappedRecipes)
      setSearchResults(mappedRecipes)
      setShowProfile(true)
    } catch (error) {
      console.error('Failed to load recipes:', error)
    } finally {
      setLoadingRecipes(false)
    }
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

  

  function saveCurrentRecipe() {
    if (auth.isGuest) {
      toast.info('Connectez-vous pour sauvegarder vos recettes')
      return
    }
    if (!auth.currentUser || !recipe.title.trim()) return

    const recipeToSave = {
      ...recipe,
      user_id: auth.currentUser.id,
      prep_time: recipe.prepTime,
      cook_time: recipe.cookTime,
      ingredients: recipe.ingredients.filter(ing => ing.trim() !== ''),
      steps: recipe.steps.filter(step => step.trim() !== ''),
      updated_at: new Date().toISOString()
    }

    if (recipe.id) {
      // Update existing recipe
      apiUpdateRecipe(recipe.id, recipeToSave)
        .then(() => {
          // Update the recipe in local state
          const updatedRecipe = { ...recipe, updatedAt: new Date().toISOString() }
          setAllRecipes(prev => prev.map(r => r.id === recipe.id ? updatedRecipe : r))
          setSearchResults(prev => prev.map(r => r.id === recipe.id ? updatedRecipe : r))
          setOriginalRecipe(updatedRecipe)
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
          const savedRecipe = { ...recipe, id: result.id, createdAt: new Date().toISOString() }
          setRecipe(savedRecipe)
          // Add new recipe to local state
          setAllRecipes(prev => [...prev, savedRecipe])
          setSearchResults(prev => [...prev, savedRecipe])
          setOriginalRecipe(savedRecipe)
          toast.success('Recette créée avec succès !')
        })
        .catch(error => {
          console.error('Failed to create recipe:', error)
          toast.error('Erreur lors de la sauvegarde')
        })
    }
  }

  function deleteRecipe(id) {
    if (!auth.currentUser) return
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
      // Remove recipe from local state immediately
      setAllRecipes(prev => prev.filter(r => r.id !== id))
      setSearchResults(prev => prev.filter(r => r.id !== id))
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
        setOriginalRecipe(null)
      }
    }).catch(error => {
      console.error('Failed to delete recipe:', error)
    })
  }

  function loadRecipe(r) {
    if (!r) return
    const loadedRecipe = {
      ...r,
      ingredients: Array.isArray(r.ingredients) && r.ingredients.length > 0 ? r.ingredients : [''],
      steps: Array.isArray(r.steps) && r.steps.length > 0 ? r.steps : [''],
      tags: Array.isArray(r.tags) ? r.tags : []
    }
    setRecipe(loadedRecipe)
    setOriginalRecipe(loadedRecipe)
    setShowProfile(false)
  }

  function openStandaloneRecipe(r) {
    hookOpenStandaloneRecipe(r)
    setShowProfile(false)
  }

  function createNew() {
    const newRecipe = { title: '', subtitle: '', servings: '', prepTime: '', cookTime: '', ingredients: [''], steps: [''], image: null, tags: [], createdAt: null, updatedAt: null }
    setRecipe(newRecipe)
    setOriginalRecipe(newRecipe)
    setShowProfile(false)
  }

  function hasUnsavedChanges() {
    if (!originalRecipe) return false
    // Compare relevant fields, excluding timestamps and id
    const current = {
      title: recipe.title,
      subtitle: recipe.subtitle,
      servings: recipe.servings,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      image: recipe.image,
      tags: recipe.tags
    }
    const original = {
      title: originalRecipe.title,
      subtitle: originalRecipe.subtitle,
      servings: originalRecipe.servings,
      prepTime: originalRecipe.prepTime,
      cookTime: originalRecipe.cookTime,
      ingredients: originalRecipe.ingredients,
      steps: originalRecipe.steps,
      image: originalRecipe.image,
      tags: originalRecipe.tags
    }
    return JSON.stringify(current) !== JSON.stringify(original)
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
    // Build options using recipe.print if available, otherwise global defaults
    const mergedPrint = recipe.print || globalPrintDefaults || {}
    const unit = mergedPrint.marginUnit || 'mm'
    // html2pdf expects margin in the same unit as jsPDF.unit; pass array [top, left, bottom, right]
    const mt = mergedPrint.marginTop != null ? Number(mergedPrint.marginTop) : 10
    const mb = mergedPrint.marginBottom != null ? Number(mergedPrint.marginBottom) : mt
    const ml = mergedPrint.marginLeft != null ? Number(mergedPrint.marginLeft) : 10
    const mr = mergedPrint.marginRight != null ? Number(mergedPrint.marginRight) : ml

    const opt = {
      margin: [mt, ml, mb, mr],
      filename: `${recipe.title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      // useCORS helps if images are loaded from remote URLs; data-URLs work without CORS.
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit, format: 'a4', orientation: 'portrait' }
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
      <AuthGate
        auth={auth}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        standaloneRecipe={standaloneRecipe}
        showHelp={showHelp}
        setShowHelp={setShowHelp}
        theme={theme}
        themeObj={themes[theme]}
        setTheme={setTheme}
        printRecipe={printRecipe}
        downloadPdf={downloadPdf}
        saveCurrentRecipe={saveCurrentRecipe}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        previewRef={previewRef}
        createNew={createNew}
        loadRecipe={loadRecipe}
        deleteRecipe={deleteRecipe}
        searchResults={searchResults}
        onUpdateUser={(u) => { const next = users.map((x) => x.id === u.id ? u : x); persistUsers(next); auth.setCurrentUser(u) }}
        handleChange={handleChange}
        recipe={recipe}
        globalPrintDefaults={globalPrintDefaults}
        setGlobalPrintDefaults={setGlobalPrintDefaults}
        openStandaloneRecipe={openStandaloneRecipe}
        setStandaloneRecipe={setStandaloneRecipe}
        setUsers={setUsers}
        setRecipe={setRecipe}
      />

      <AppModals
        auth={auth}
        showBackConfirm={showBackConfirm}
        setShowBackConfirm={setShowBackConfirm}
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        saveCurrentRecipe={saveCurrentRecipe}
        setShowProfile={setShowProfile}
        confirmDelete={confirmDelete}
      />
    </div>
  )
}

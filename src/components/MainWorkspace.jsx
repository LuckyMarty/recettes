import React from 'react'
import { SearchBar, Tutorial, RecipeEditor, RecipePreview, Header } from './index.js'
import Profile from '../components/Profile.jsx'
import RecipePage from '../Recipe.jsx'

export default function MainWorkspace(props) {
  const {
    showProfile,
    setShowProfile,
    standaloneRecipe,
    showHelp,
    setShowHelp,
    theme,
    setTheme,
    printRecipe,
    downloadPdf,
    saveCurrentRecipe,
    isGuest,
    setShowAuth,
    handleLogout,
    currentUser,
    setIsGuest,
    searchQuery,
    setSearchQuery,
    previewRef,
    createNew,
    loadRecipe,
    deleteRecipe,
    searchResults,
    onUpdateUser,
    handleChange,
    recipe,
    globalPrintDefaults,
    setGlobalPrintDefaults,
    openStandaloneRecipe,
    setStandaloneRecipe,
    setUsers
  } = props

  return (
    <>
      <Header
        showProfile={showProfile}
        standaloneRecipe={standaloneRecipe}
        theme={theme}
        setTheme={setTheme}
        showHelp={showHelp}
        setShowHelp={setShowHelp}
        printRecipe={printRecipe}
        downloadPdf={downloadPdf}
        saveCurrentRecipe={saveCurrentRecipe}
        isGuest={isGuest}
        setShowAuth={setShowAuth}
        handleLogout={handleLogout}
        currentUser={currentUser}
        setShowProfile={setShowProfile}
        setIsGuest={setIsGuest}
      />

      {/* Mobile search - full width below header */}
      {showProfile && (
        <div className="mobile-search">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      )}

      {standaloneRecipe ? (
        <main className="standalone-recipe">
          <section style={{ width: '100%' }}>
            <RecipePage recipe={standaloneRecipe} />
          </section>
        </main>
      ) : (
        <main className={showProfile ? "full-profile" : "split"}>
          <section className="left" style={showProfile ? { width: '100%' } : {}}>
            {showProfile && !isGuest ? (
              <Profile
                user={currentUser}
                searchResults={searchResults}
                searchQuery={searchQuery}
                onLogout={handleLogout}
                onLoadRecipe={loadRecipe}
                onDeleteRecipe={deleteRecipe}
                onCreateNew={createNew}
                onPrintRecipe={printRecipe}
                onSaveRecipe={saveCurrentRecipe}
                onUpdateUser={onUpdateUser}
                onViewRecipe={(r) => {
                  try {
                    const id = r && r.id ? String(r.id) : `temp_${Date.now()}`
                    sessionStorage.setItem('standaloneRecipe', JSON.stringify(r))
                    sessionStorage.setItem(`standaloneRecipe_${id}`, JSON.stringify(r))
                    const params = new URLSearchParams(window.location.search)
                    params.set('view', id)
                    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
                  } catch (e) {
                    // ignore storage errors
                  }
                  setStandaloneRecipe(r)
                  setShowProfile(false)
                }}
              />
            ) : (
              <>
                {showHelp && (
                  <Tutorial onClose={() => setShowHelp(false)} />
                )}
                <RecipeEditor
                  recipe={recipe}
                  onChange={handleChange}
                  globalPrintDefaults={globalPrintDefaults}
                  setGlobalPrintDefaults={setGlobalPrintDefaults}
                  onViewRecipe={openStandaloneRecipe}
                />
              </>
            )}
          </section>
          {!showProfile && (
            <section className="right">
              <div
                ref={previewRef}
                data-tutorial="preview"
                className="preview-wrapper"
                style={{
                  ...( (() => {
                    const merged = recipe.print || globalPrintDefaults || {}
                    const unit = merged.marginUnit || 'mm'
                    const title = merged.titleFontSize != null ? `${merged.titleFontSize}px` : undefined
                    const subtitle = merged.subtitleFontSize != null ? `${merged.subtitleFontSize}px` : undefined
                    const body = merged.bodyFontSize != null ? `${merged.bodyFontSize}px` : undefined
                    const categories = merged.categoriesFontSize != null ? `${merged.categoriesFontSize}px` : undefined
                    const meta = merged.metaFontSize != null ? `${merged.metaFontSize}px` : undefined
                    const ingTitle = merged.ingredientsTitleFontSize != null ? `${merged.ingredientsTitleFontSize}px` : undefined
                    const ingBodyVal = merged.ingredientsBodyFontSize != null ? merged.ingredientsBodyFontSize : merged.ingredientsFontSize
                    const ingBody = ingBodyVal != null ? `${ingBodyVal}px` : undefined
                    const stepTitle = merged.stepsTitleFontSize != null ? `${merged.stepsTitleFontSize}px` : undefined
                    const stepBodyVal = merged.stepsBodyFontSize != null ? merged.stepsBodyFontSize : merged.stepsFontSize
                    const stepBody = stepBodyVal != null ? `${stepBodyVal}px` : undefined
                    const stepNumber = merged.stepNumberFontSize != null ? `${merged.stepNumberFontSize}px` : undefined

                    return {
                      '--print-title-font-size': title,
                      '--print-subtitle-font-size': subtitle,
                      '--print-body-font-size': body,
                      '--print-categories-font-size': categories,
                      '--print-meta-font-size': meta,
                      '--print-ingredients-title-font-size': ingTitle,
                      '--print-ingredients-font-size': ingBody,
                      '--print-steps-title-font-size': stepTitle,
                      '--print-steps-font-size': stepBody,
                      '--print-step-number-font-size': stepNumber,
                      '--accent': props.themeObj ? props.themeObj.accent : undefined,
                      '--accent-light': props.themeObj ? props.themeObj.light : undefined,
                      '--print-margin-top': (merged.marginTop != null ? String(merged.marginTop) + unit : undefined),
                      '--print-margin-bottom': (merged.marginBottom != null ? String(merged.marginBottom) + unit : undefined),
                      '--print-margin-left': (merged.marginLeft != null ? String(merged.marginLeft) + unit : undefined),
                      '--print-margin-right': (merged.marginRight != null ? String(merged.marginRight) + unit : undefined)
                    }
                  })() )
                }}
              >
                <RecipePreview recipe={recipe} globalPrintDefaults={globalPrintDefaults} />
              </div>
            </section>
          )}
        </main>
      )}
    </>
  )
}

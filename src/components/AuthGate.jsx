import React from 'react'
import AuthLanding from './AuthLanding.jsx'
import MainWorkspace from './MainWorkspace.jsx'

export default function AuthGate(props) {
  const { auth } = props

  // Pass through remaining props to MainWorkspace or AuthLanding as before
  return (
    <>
      {!auth.currentUser && !auth.isGuest ? (
        <AuthLanding
          showAuth={auth.showAuth}
          setShowAuth={auth.setShowAuth}
          setIsGuest={auth.setIsGuest}
          setRecipe={props.setRecipe}
          handleLogin={auth.handleLogin}
          handleSignup={auth.handleSignup}
        />
      ) : (
        <MainWorkspace
          showProfile={props.showProfile}
          setShowProfile={props.setShowProfile}
          standaloneRecipe={props.standaloneRecipe}
          showHelp={props.showHelp}
          setShowHelp={props.setShowHelp}
          theme={props.theme}
          themeObj={props.themeObj}
          setTheme={props.setTheme}
          printRecipe={props.printRecipe}
          downloadPdf={props.downloadPdf}
          saveCurrentRecipe={props.saveCurrentRecipe}
          isGuest={auth.isGuest}
          setShowAuth={auth.setShowAuth}
          handleLogout={auth.handleLogout}
          currentUser={auth.currentUser}
          setIsGuest={auth.setIsGuest}
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          previewRef={props.previewRef}
          createNew={props.createNew}
          loadRecipe={props.loadRecipe}
          deleteRecipe={props.deleteRecipe}
          searchResults={props.searchResults}
          onUpdateUser={props.onUpdateUser}
          handleChange={props.handleChange}
          recipe={props.recipe}
          globalPrintDefaults={props.globalPrintDefaults}
          setGlobalPrintDefaults={props.setGlobalPrintDefaults}
          openStandaloneRecipe={props.openStandaloneRecipe}
          setStandaloneRecipe={props.setStandaloneRecipe}
          setUsers={props.setUsers}
        />
      )}
    </>
  )
}

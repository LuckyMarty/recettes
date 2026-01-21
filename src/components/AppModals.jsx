import React from 'react'
import { Auth, ConfirmModal } from './index'
import { Toaster } from 'react-hot-toast'

export default function AppModals(props) {
  const { auth, showBackConfirm, setShowBackConfirm, deleteConfirm, setDeleteConfirm, saveCurrentRecipe, setShowProfile } = props

  return (
    <>
      {auth.showAuth && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.3)'}}>
          <Auth onLogin={auth.handleLogin} onSignup={auth.handleSignup} onClose={() => auth.setShowAuth(false)} />
        </div>
      )}
      <ConfirmModal
        open={showBackConfirm}
        title="Modifications non sauvegardées"
        actions={[
          { label: 'Annuler', onClick: () => setShowBackConfirm(false) },
          { label: 'Abandonner les modifications', onClick: () => { setShowBackConfirm(false); if (auth.isGuest) { auth.setIsGuest(false) } else { setShowProfile(true) } } },
          { label: 'Sauvegarder et quitter', onClick: () => { setShowBackConfirm(false); saveCurrentRecipe(); setTimeout(() => { if (auth.isGuest) { auth.setIsGuest(false) } else { setShowProfile(true) } }, 100) }, variant: 'primary' }
        ]}
      >
        Vous avez des modifications non sauvegardées. Que souhaitez-vous faire ?
      </ConfirmModal>
      <ConfirmModal
        open={!!deleteConfirm}
        title="Confirmer la suppression"
        actions={[
          { label: 'Annuler', onClick: () => setDeleteConfirm(null) },
          { label: 'Supprimer', onClick: props.confirmDelete, variant: 'danger' }
        ]}
      >
        {deleteConfirm ? (<span>Êtes-vous sûr de vouloir supprimer la recette "<strong>{deleteConfirm.title}</strong>" ?<br/>Cette action est irréversible.</span>) : null}
      </ConfirmModal>
      <Toaster position="bottom-right" />
    </>
  )
}

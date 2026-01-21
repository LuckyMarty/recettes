import React from 'react'

export default function ConfirmModal({ open, title, children, actions = [] }) {
  if (!open) return null
  return (
    <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.3)',zIndex:1000}}>
      <div style={{background:'white',padding:'20px',borderRadius:'8px',maxWidth:'400px',width:'90%'}}>
        <h3 style={{margin:'0 0 16px 0',color:'#333'}}>{title}</h3>
        <div style={{margin:'0 0 20px 0',color:'#666'}}>
          {children}
        </div>
        <div style={{display:'flex',gap:'12px',justifyContent:'flex-end'}}>
          {actions.map((a, idx) => (
            <button
              key={idx}
              onClick={a.onClick}
              style={a.variant === 'danger' ? {padding:'8px 16px',border:'none',borderRadius:'4px',background:'#dc3545',color:'white',cursor:'pointer'} : (a.variant === 'primary' ? {padding:'8px 16px',border:'none',borderRadius:'4px',background:'var(--accent)',color:'white',cursor:'pointer'} : {padding:'8px 16px',border:'1px solid #ddd',borderRadius:'4px',background:'white',cursor:'pointer'})}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

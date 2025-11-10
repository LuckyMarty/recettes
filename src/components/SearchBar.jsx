import React from 'react'

export default function SearchBar({ value, onChange, placeholder = 'Rechercher des recettes...' }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <input
        className="theme-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{padding:'8px 12px', minWidth:320}}
      />
    </div>
  )
}

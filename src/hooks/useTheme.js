import { useState } from 'react'

export default function useTheme(initial = 'orange') {
  const [theme, setTheme] = useState(initial)
  const themes = {
    orange: { accent: '#e67e50', light: '#fef3ed' },
    blue: { accent: '#4a90e2', light: '#e8f4fd' },
    green: { accent: '#52c41a', light: '#f0fae8' },
    purple: { accent: '#9c27b0', light: '#f3e5f5' },
    pink: { accent: '#ec407a', light: '#fce4ec' }
  }

  return { theme, setTheme, themes }
}

// src/plugins/vuetify.ts
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const obrakitTheme = {
  dark: false,
  colors: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    'surface-variant': '#F1F5F9',
    primary: '#EA580C', // Industrial Safety Orange
    secondary: '#475569', // Slate Steel
    accent: '#0284C7', // Vivid Cyan
    error: '#EF4444',
    info: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
  },
}

const obrakitThemeDark = {
  dark: true,
  colors: {
    background: '#0F172A', // Deep Slate
    surface: '#1E293B', // Card Surface
    'surface-variant': '#334155',
    primary: '#FF6B00', // Neon Construction Orange
    secondary: '#94A3B8', // Muted Steel
    accent: '#38BDF8', // Cyan Glow
    error: '#F87171',
    info: '#60A5FA',
    success: '#34D399',
    warning: '#FBBF24',
  },
}

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'obrakitThemeDark',
    themes: {
      obrakitTheme,
      obrakitThemeDark,
    },
  },
})

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
    'on-background': '#0F172A',
    'on-surface': '#0F172A',
    'on-surface-variant': '#475569',
    primary: '#EA580C', // Safety Orange
    secondary: '#475569', // Slate Steel
    accent: '#0284C7', // Vivid Sky Blue
    error: '#DC2626',
    info: '#2563EB',
    success: '#16A34A',
    warning: '#D97706',
  },
}

const obrakitThemeDark = {
  dark: true,
  colors: {
    background: '#0F172A', // Deep Slate
    surface: '#1E293B', // Card Surface
    'surface-variant': '#334155',
    'on-background': '#F8FAFC',
    'on-surface': '#F8FAFC',
    'on-surface-variant': '#94A3B8',
    primary: '#FF6B00', // Bright Orange Glow
    secondary: '#94A3B8', // Muted Steel
    accent: '#38BDF8', // Cyan Accent
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

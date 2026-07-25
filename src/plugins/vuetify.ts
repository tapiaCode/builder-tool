// src/plugins/vuetify.ts
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

// Custom theme
const obrakitTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    primary: '#FF6F00', // Construction Orange
    secondary: '#455A64', // Industrial Grey
    accent: '#1976D2', // Steel Blue
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

const obrakitThemeDark = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#FF8F00', // Brighter Construction Orange
    secondary: '#607D8B', // Light Industrial Grey
    accent: '#42A5F5', // Light Steel Blue
    error: '#CF6679',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
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

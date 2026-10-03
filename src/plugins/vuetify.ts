// src/plugins/vuetify.ts
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const obrakitTheme = {
  dark: false,
  colors: {
    background: '#F6F5F2', // Warm paper
    surface: '#FFFFFF',
    'surface-variant': '#EFEDE8',
    'on-background': '#15181D',
    'on-surface': '#15181D',
    'on-surface-variant': '#4B5260',
    primary: '#E2600A', // Safety Orange
    secondary: '#4B5260',
    accent: '#0B78B8',
    error: '#C9302C',
    info: '#1F63D6',
    success: '#16833F',
    warning: '#B86A00',
  },
}

const obrakitThemeDark = {
  dark: true,
  colors: {
    background: '#0D1015', // Ink
    surface: '#151920', // Card
    'surface-variant': '#1E232C',
    'on-background': '#F2F4F7',
    'on-surface': '#F2F4F7',
    'on-surface-variant': '#A7AFBC',
    primary: '#FF7A1A', // Bright Orange
    secondary: '#A7AFBC',
    accent: '#3BA3FF',
    error: '#FF6B6B',
    info: '#62A8FF',
    success: '#34C77B',
    warning: '#F5A524',
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
  defaults: {
    VCard: { rounded: 'xl' },
    VBtn: { rounded: 'lg', class: 'text-none font-weight-bold', style: 'letter-spacing: 0' },
    VTextField: { variant: 'outlined', rounded: 'lg', color: 'primary' },
    VTextarea: { variant: 'outlined', rounded: 'lg', color: 'primary' },
    VSelect: { variant: 'outlined', rounded: 'lg', color: 'primary' },
    VChip: { rounded: 'pill' },
    VAlert: { rounded: 'lg' },
    VSnackbar: { rounded: 'pill' },
  },
})

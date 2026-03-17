/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#f8f6f0',
          surface: '#ffffff',
          primary: '#2f6f62',
          secondary: '#6b5b4b',
          error: '#b42318',
          info: '#2563eb',
          success: '#15803d',
          warning: '#b45309',
        },
      },
    },
  },
})

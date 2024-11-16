import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Error tracking
const errorHandler = (err: unknown, vm: any, info: string) => {
  console.error('Global error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
  // Here you would typically send to your error tracking service
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#1e1e1e',
          surface: '#1e1e1e',
          primary: '#0078d4',
          secondary: '#3794ff',
          success: '#89d185',
          warning: '#cca700',
          error: '#f14c4c',
        }
      }
    }
  },
  defaults: {
    VBtn: {
      variant: 'elevated',
    },
    VCard: {
      elevation: 1,
    },
    global: {
      ripple: true,
    }
  }
})

const app = createApp(App)
app.config.errorHandler = errorHandler
app.config.performance = import.meta.env.PROD
app.use(vuetify)
app.mount('#app')
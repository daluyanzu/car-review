/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

import 'mosha-vue-toastify/dist/style.css'
import '@mdi/font/css/materialdesignicons.css'
// Components
import App from './App.vue'
import store from './store/index.js'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)
app.use(store)
app.mount('#app')

import './assets/css/main.css'
import { createApp } from 'vue'

import App from './App.vue'

import { setupRouter } from "./router"
import { setupStore } from "@/stores"
import { setupI18n } from './plugins/i18n'

async function setupApp() {

    const app = createApp(App)


    setupStore(app)

    await setupRouter(app)
    await setupI18n(app)

    app.mount('#app', true)
}

setupApp()
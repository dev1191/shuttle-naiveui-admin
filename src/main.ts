import './assets/css/main.css'
import OpenLayersMap from 'vue3-openlayers'
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

    app.use(OpenLayersMap)

    app.mount('#app')
}

setupApp()
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { App } from 'vue';

// Create pinia instance at module level (required for DevTools)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);

export function setupStore(app: App<Element>) {
    app.use(pinia)
}


export * from './theme'
export * from './auth'
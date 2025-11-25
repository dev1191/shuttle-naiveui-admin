import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import routes from './routes'
import { createRouterGuard } from './guard'
// import { useDiscreteApi } from '@/composables'
// import { authGuard } from './guard'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    strict: true,
})


export async function setupRouter(app: App) {
    app.use(router)
    createRouterGuard(router)
    await router.isReady()
}

export default router
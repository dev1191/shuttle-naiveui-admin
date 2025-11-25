import { discrete } from '@/composables';
import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function createRouterGuard(router: Router) {

    router.beforeEach((to, _from, next) => {
        discrete.loadingBar?.start()

        const authStore = useAuthStore()

        // If route requires authentication and user is not logged in
        if (to.meta?.requiresAuth && !authStore.isLoggedIn) {
            discrete.loadingBar?.finish()
            return next({
                name: 'signIn',
                query: { r: to.fullPath } // Save redirect path
            })
        }

        // If route is for guests only and user is logged in
        if (to.meta?.guest && authStore.isLoggedIn) {
            discrete.loadingBar?.finish()
            return next({ name: 'dashboard' })
        }

        // Check role-based access
        if (to.meta?.roles && authStore.isLoggedIn) {
            const roles = to.meta.roles as string[]
            if (!roles.includes(authStore.userRole)) {
                discrete.loadingBar?.finish()
                discrete.message?.error('You do not have permission to access this page')
                return next({ name: 'dashboard' })
            }
        }

        next()
    });

    router.afterEach(() => {
        discrete.loadingBar?.finish()
    });

    router.onError((error) => {
        console.error('Router error:', error)
        discrete.loadingBar?.error()
    })
}

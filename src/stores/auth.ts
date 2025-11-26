import { defineStore, storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Role, GeneralSettings, Option, LanguageOption } from '@/types'
import { authApi, type LoginRequest } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const user = ref<User | null>(null)
    const permissions = ref<string[]>([])
    const roles = ref<Option[]>([])
    const generalSettings = ref<GeneralSettings | null>(null)
    const languages = ref<LanguageOption[]>([])

    const isLoggedIn = computed(() => !!token.value)
    const userRole = computed<Role>(() => user.value?.role ?? 'guest')

    function setAuth(payload: { token: string; refreshToken?: string; user: User }) {
        token.value = payload.token
        if (payload.refreshToken) refreshToken.value = payload.refreshToken
        user.value = payload.user
    }

    async function setPermissions() {
        const response = await authApi.access()
        permissions.value = response.permissions
        generalSettings.value = response.generalSettings
        roles.value = response.roles
        languages.value = response.languages
    }


    function clearAuth() {
        token.value = null
        refreshToken.value = null
        user.value = null
    }

    async function login(credentials: LoginRequest) {
        try {
            const response = await authApi.login(credentials)
            setAuth({
                token: response.accessToken,
                refreshToken: response.refreshToken,
                user: response.user
            })
            await setPermissions()
            return { success: true }
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            }
        }
    }

    async function logout() {
        try {
            await authApi.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            clearAuth()
        }
    }

    return {
        token,
        refreshToken,
        user,
        permissions,
        roles,
        generalSettings,
        languages,
        isLoggedIn,
        userRole,
        setAuth,
        setPermissions,
        clearAuth,
        login,
        logout
    }
}, {
    persist: {
        key: 'auth-store',
        storage: localStorage,
        pick: ['token', 'refreshToken', 'user', 'permissions', 'roles', 'generalSettings', 'languages']
    }
})

export function toRefsAuthStore() {
    return {
        ...storeToRefs(useAuthStore()),
    }
}


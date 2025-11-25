import type { Directive } from 'vue'
import { useAuthStore } from '@/stores/auth'


// v-can="'permission'" or v-can="['roleA','roleB']"
export const vCan: Directive = {
    mounted(el, binding) {
        const auth = useAuthStore()
        const value = binding.value


        let allowed = false
        if (Array.isArray(value)) {
            allowed = value.includes(auth.userRole)
        } else if (typeof value === 'string') {
            allowed = auth.userRole === value
        }


        if (!allowed) el.parentNode?.removeChild(el)
    }
}
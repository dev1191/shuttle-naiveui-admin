import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/auth',
        component: () => import('@/layouts/AuthLayout.vue'),
        children: [
            {
                path: 'sign-in',
                name: 'signIn',
                component: () => import('@/pages/Auth/SignIn/index.vue'),
                meta: { guest: true, layout: 'auth' }
            },
            {
                path: 'reset-password',
                name: 'resetPassword',
                component: () => import('@/pages/Auth/ResetPassword/index.vue'),
                meta: { guest: true, layout: 'auth' }
            },
        ]
    },
    {
        name: 'errorPage',
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/ErrorPage/index.vue'),
        meta: { guest: true, layout: 'auth' }
    },

    {
        path: '/',
        component: () => import('@/layouts/AdminLayout.vue'),
        meta: { requiresAuth: true, layout: 'admin' },
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('@/pages/Dashboard/Index.vue'),
                meta: { title: 'Dashboard', icon: 'BarChart', roles: ['admin', 'manager', 'staff'] }
            },
            {
                path: '/users',
                name: 'users',
                component: () => import('@/pages/Users/List.vue'),
                meta: { title: 'Users', icon: 'Users', roles: ['admin'] }
            },
            {
                path: '/roles',
                name: 'roles',
                component: () => import('@/pages/RoleAndPermissions/Roles/Index.vue'),
                meta: { title: 'Roles', icon: 'Shield', roles: ['admin'] }
            },
            {
                path: '/drivers',
                name: 'drivers',
                meta: { title: 'Manage Drivers', icon: 'Car', roles: ['admin', 'manager'] },
                children: [
                    {
                        path: 'list',
                        name: 'driversList',
                        component: () => import('@/pages/Drivers/List.vue'),
                        meta: { title: 'Drivers List', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'create',
                        name: 'createDriver',
                        component: () => import('@/pages/Drivers/Create.vue'),
                        meta: { title: 'Create Driver', roles: ['admin', 'manager'] }
                    }
                ]
            },
            {
                path: '/settings',
                name: 'settings',
                component: () => import('@/pages/Settings/Index.vue'),
                meta: { title: 'Settings', icon: 'Settings', roles: ['admin', 'manager'] }
            },
        ]
    }
]

export default routes
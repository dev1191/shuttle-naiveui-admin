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
                path: '/buses',
                name: 'buses',
                meta: { title: 'Manage Buses', icon: 'Bus', roles: ['admin', 'manager'] },
                children: [
                    {
                        path: 'buseslist',
                        name: 'busesList',
                        component: () => import('@/pages/ManageBuses/Bus/Index.vue'),
                        meta: { title: 'Buses List', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'create',
                        name: 'createBus',
                        component: () => import('@/pages/ManageBuses/Bus/Create.vue'),
                        meta: { title: 'Create Bus', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'bustypelist',
                        name: 'busTypesList',
                        component: () => import('@/pages/ManageBuses/BusType/Index.vue'),
                        meta: { title: 'Bus Types List', roles: ['admin', 'manager'] }
                    },
                ]
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
                path: '/customers',
                name: 'customers',
                meta: { title: 'Manage Customers', icon: 'User', roles: ['admin', 'manager'] },
                children: [
                    {
                        path: 'list',
                        name: 'customersList',
                        component: () => import('@/pages/Customers/List.vue'),
                        meta: { title: 'Customers List', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'walletRecharge',
                        name: 'walletRecharge',
                        component: () => import('@/pages/Customers/Wallets/WalletRecharge.vue'),
                        meta: { title: 'Wallet Recharge', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'walletHistory/:id?',
                        name: 'walletHistory',
                        component: () => import('@/pages/Customers/Wallets/History.vue'),
                        meta: { title: 'Wallet History', roles: ['admin', 'manager'], hideInMenu: true }
                    },
                    {
                        path: 'referral',
                        name: 'referral',
                        component: () => import('@/pages/Customers/Referral.vue'),
                        meta: { title: 'Referrals', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'suggestion',
                        name: 'suggestion',
                        component: () => import('@/pages/Customers/Suggestion.vue'),
                        meta: { title: 'Suggestions', roles: ['admin', 'manager'] }
                    }

                ]
            },
            {
                path: '/settings',
                name: 'settings',
                redirect: { name: 'siteSettings' },
                meta: { title: 'Settings', icon: 'Settings', roles: ['admin', 'manager'] },
                children: [
                    {
                        path: 'site-settings',
                        name: 'siteSettings',
                        component: () => import('@/pages/Settings/SiteSettings/Index.vue'),
                        meta: { title: 'Site Settings', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'countries',
                        name: 'countries',
                        component: () => import('@/pages/Settings/Countries/Index.vue'),
                        meta: { title: 'Countries', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'currencies',
                        name: 'currencies',
                        component: () => import('@/pages/Settings/Currencies/Index.vue'),
                        meta: { title: 'Currencies', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'languages',
                        name: 'languages',
                        component: () => import('@/pages/Settings/Languages/Index.vue'),
                        meta: { title: 'Languages', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'emailSettings',
                        name: 'emailSettings',
                        component: () => import('@/pages/Settings/Email/Index.vue'),
                        meta: { title: 'Email Settings', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'storageSettings',
                        name: 'storageSettings',
                        component: () => import('@/pages/Settings/Storage/Index.vue'),
                        meta: { title: 'Storage Settings', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'referralSettings',
                        name: 'referralSettings',
                        component: () => import('@/pages/Settings/Referral/Index.vue'),
                        meta: { title: 'Referral Settings', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'notificationSettings',
                        name: 'notificationSettings',
                        component: () => import('@/pages/Settings/Notification/Index.vue'),
                        meta: { title: 'Notification Settings', roles: ['admin', 'manager'] }
                    },
                    {
                        path: 'refundSettings',
                        name: 'refundSettings',
                        component: () => import('@/pages/Settings/Refund/Index.vue'),
                        meta: { title: 'Refund Settings', roles: ['admin', 'manager'] }
                    }
                ]
            },
        ]
    }
]

export default routes
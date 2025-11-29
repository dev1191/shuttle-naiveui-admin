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
                meta: { title: 'Dashboard', icon: 'LayoutDashboard', roles: ['admin', 'manager', 'staff'] }
            },
            {
                path: '/admin-users',
                name: 'adminUsers',
                meta: { title: 'Manage Admin Users', icon: 'Users', roles: ['admin', 'manager'] },
                children: [
                    {
                        path: 'list',
                        name: 'usersList',
                        component: () => import('@/pages/Users/List.vue'),
                        meta: { title: 'Users List', icon: 'UsersRound', roles: ['admin'] }
                    },
                    {
                        path: '/roles',
                        name: 'roles',
                        component: () => import('@/pages/RoleAndPermissions/Roles/Index.vue'),
                        meta: { title: 'Roles', icon: 'Shield', roles: ['admin'] }
                    },
                    {
                        path: '/roles/:id',
                        name: 'role',
                        component: () => import('@/pages/RoleAndPermissions/Roles/_id.vue'),
                        meta: { title: 'Role', icon: 'Shield', roles: ['admin'], hideInMenu: true }
                    }
                ]
            },

            {
                path: '/buses',
                name: 'buses',
                meta: { title: 'Manage Buses', icon: 'BusFront', roles: ['admin', 'manager'] },
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
                    {
                        path: 'buslayoutlist',
                        name: 'busLayoutsList',
                        component: () => import('@/pages/ManageBuses/BusLayout/Index.vue'),
                        meta: { title: 'Bus Layouts List', roles: ['admin', 'manager'] }
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
                        path: 'bookingHistory/:id?',
                        name: 'bookingHistory',
                        component: () => import('@/pages/Customers/Bookings/History.vue'),
                        meta: { title: 'Booking History', roles: ['admin', 'manager'], hideInMenu: true }
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
                path: '/offers',
                name: 'offers',
                component: () => import('@/pages/Offers/Index.vue'),
                meta: { title: 'Manage Offers', icon: 'TicketPercent', roles: ['admin'] }
            },
            {
                path: '/passes',
                name: 'passes',
                component: () => import('@/pages/Passes/Index.vue'),
                meta: { title: 'Manage Passes', icon: 'Ticket', roles: ['admin'] }
            },
            {
                path: '/help-and-support',
                name: 'helpAndSupport',
                component: () => import('@/pages/HelpAndSupport/Index.vue'),
                meta: { title: 'Manage Help And Support', icon: 'HandHelping', roles: ['admin'] }
            },
            {
                path: '/send-message',
                name: 'sendMessage',
                component: () => import('@/pages/SendMessage/Index.vue'),
                meta: { title: 'Send Message', icon: 'Bell', roles: ['admin'] }
            },
            {
                path: '/send-message/create',
                name: 'sendMessageCreate',
                component: () => import('@/pages/SendMessage/Create.vue'),
                meta: { title: 'Send Message', icon: 'Bell', roles: ['admin'], hideInMenu: true }
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
                        meta: { title: 'Countries', roles: ['admin', 'manager'], hideInMenu: true }
                    },
                    {
                        path: 'currencies',
                        name: 'currencies',
                        component: () => import('@/pages/Settings/Currencies/Index.vue'),
                        meta: { title: 'Currencies', roles: ['admin', 'manager'], hideInMenu: true }
                    },
                    {
                        path: 'languages',
                        name: 'languages',
                        component: () => import('@/pages/Settings/Languages/Index.vue'),
                        meta: { title: 'Languages', roles: ['admin', 'manager'], hideInMenu: true }
                    },
                    {
                        path: 'emailSettings',
                        name: 'emailSettings',
                        component: () => import('@/pages/Settings/Email/Index.vue'),
                        meta: { title: 'Email Settings', roles: ['admin', 'manager'], hideInMenu: true }
                    },
                    {
                        path: 'storageSettings',
                        name: 'storageSettings',
                        component: () => import('@/pages/Settings/Storage/Index.vue'),
                        meta: { title: 'Storage Settings', roles: ['admin', 'manager'], hideInMenu: true }
                    },
                    {
                        path: 'referralSettings',
                        name: 'referralSettings',
                        component: () => import('@/pages/Settings/Referral/Index.vue'),
                        meta: { title: 'Referral Settings', roles: ['admin', 'manager'], hideInMenu: true }
                    },
                    {
                        path: 'notificationSettings',
                        name: 'notificationSettings',
                        component: () => import('@/pages/Settings/Notification/Index.vue'),
                        meta: { title: 'Notification Settings', roles: ['admin', 'manager'], hideInMenu: true }
                    },
                    {
                        path: 'refundSettings',
                        name: 'refundSettings',
                        component: () => import('@/pages/Settings/Refund/Index.vue'),
                        meta: { title: 'Refund Settings', roles: ['admin', 'manager'], hideInMenu: true }
                    },
                    {
                        path: 'pages',
                        name: 'pages',
                        component: () => import('@/pages/Settings/Page/Index.vue'),
                        meta: { title: 'Pages', roles: ['admin', 'manager'], hideInMenu: true }
                    },
                ]
            },
        ]
    }
]

export default routes
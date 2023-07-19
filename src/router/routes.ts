import type { RouteRecordRaw } from 'vue-router';
export const ConstantRoute: RouteRecordRaw[] = [
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        name: 'Login',
        meta: {
            title: '登录',
            hidden: true,
            icon: ''
        }
    },
    {
        path: '/',
        component: () => import('@/layout/index.vue'),
        name: 'Layout',
        meta: {
            title: '',
        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/views/home/index.vue'),
                name: 'Home',
                meta: {
                    title: '首页',
                    icon: 'HomeFilled'
                }
            },
        ]
    },
    {
        path: '/404',
        component: () => import('@/views/404/index.vue'),
        name: '404',
        meta: {
            title: '404',
            hidden: true
        }
    },
    {
        path: '/screen',
        component: () => import('@/views/dataScreen/index.vue'),
        name: 'Screen',
        meta: {
            title: '数据大屏',
            icon: 'Platform'
        }
    },
    {
        path: '/data',
        component: () => import('@/layout/index.vue'),
        name: 'Data',
        meta: {
            title: '',
        },
        redirect: '/data/view',
        children: [
            {
                path: '/data/view',
                component: () => import('@/views/dataVisualize/index.vue'),
                name: 'Data',
                meta: {
                    title: '数据可视化',
                    icon: 'TrendCharts'
                }
            },
        ]
    }
]

export const permissionRoute: RouteRecordRaw[] = [
    {
        path: '/acl',
        component: () => import('@/layout/index.vue'),
        name: 'Acl',
        meta: {
            title: '权限管理',
            icon: 'Lock'
        },
        redirect: '/acl/user',
        children: [
            {
                path: '/acl/user',
                component: () => import('@/views/acl/user/index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',
                    icon: 'User'
                }
            },
            {
                path: '/acl/role',
                component: () => import('@/views/acl/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',
                    icon: 'UserFilled'
                }
            },
            {
                path: '/acl/permission',
                component: () => import('@/views/acl/permission/index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',
                    icon: 'Monitor'
                }
            },
        ]
    },
    {
        path: '/product',
        component: () => import('@/layout/index.vue'),
        name: 'Product',
        meta: {
            title: '商品管理',
            icon: 'Goods'
        },
        redirect: '/product/trademark',
        children: [
            {
                path: '/product/trademark',
                component: () => import('@/views/product/trademark/index.vue'),
                name: 'Trademark',
                meta: {
                    title: '品牌管理',
                    icon: 'ShoppingCartFull'
                }
            },
            {
                path: '/product/attr',
                component: () => import('@/views/product/attr/index.vue'),
                name: 'Attr',
                meta: {
                    title: '属性管理',
                    icon: 'ChromeFilled'
                }
            },
            {
                path: '/product/spu',
                component: () => import('@/views/product/spu/index.vue'),
                name: 'Spu',
                meta: {
                    title: 'SPU管理',
                    icon: 'Calendar'
                }
            },
            {
                path: '/product/sku',
                component: () => import('@/views/product/sku/index.vue'),
                name: 'Sku',
                meta: {
                    title: 'SKU管理',
                    icon: 'Orange'
                }
            },
        ]
    },
    {
        path:'/order',
        component: () => import('@/layout/index.vue'),
        name: 'Order',
        meta: {
            title: '订单管理',
            icon: 'Tickets'
        },
        redirect: '/order/orderList',
        children: [
            {
                path: '/order/orderList',
                component: () => import('@/views/order/orderList/index.vue'),
                name: 'OrderList',
                meta: {
                    title: '订单列表',
                    icon: 'Document'
                }
            },
            {
                path: '/order/refund',
                component: () => import('@/views/order/refund/index.vue'),
                name: 'Refund',
                meta: {
                    title: '退款管理',
                    icon: 'Memo'
                }
            },
        ]
    },
    {
        path:'/clientUser',
        component: () => import('@/layout/index.vue'),
        name: 'ClientUser',
        meta: {
            title: '客户管理',
            icon: 'Avatar'
        },
        redirect: '/clientUser/userList',
        children: [
            {
                path: '/clientUser/userList',
                component: () => import('@/views/clientUser/userList/index.vue'),
                name: 'UserList',
                meta: {
                    title: '客户列表',
                    icon: 'Postcard'
                }
            },
        ]
    },
    {
        path:'/discount',
        component: () => import('@/layout/index.vue'),
        name: 'Discount',
        meta: {
            title: '优惠管理',
            icon: 'Present'
        },
        redirect: '/discount/userList',
        children: [
            {
                path: '/discount/activity',
                component: () => import('@/views/discount/activity/index.vue'),
                name: 'Activity',
                meta: {
                    title: '优惠活动管理',
                    icon: 'List'
                }
            },
            {
                path: '/discount/coupon',
                component: () => import('@/views/discount/coupon/index.vue'),
                name: 'Coupon',
                meta: {
                    title: '优惠券管理',
                    icon: 'Ticket'
                }
            },
        ]
    }
]

export const anyRoute: RouteRecordRaw[] = [
    {
        //未匹配路由则重定向到404
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'Any',
        meta: {
            title: '任意路由',
            hidden: true
        }
    },
]
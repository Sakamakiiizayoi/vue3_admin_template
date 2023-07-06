//用户相关的小仓库
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user';
import { defineStore } from 'pinia';
import type { loginForm } from '@/api/user/type';
import { ConstantRoute, permissionRoute, anyRoute } from '@/router/routes';
import router from '@/router';
import type { RouteRecordRaw } from 'vue-router';

const TOKEN = {
    getToken() {
        return localStorage.getItem('TOKEN')
    },
    setToken(token: string) {
        localStorage.setItem('TOKEN', token)
    },
    removeToken() {
        localStorage.removeItem('TOKEN')
    }
}

const filterRoute = (perRoute: RouteRecordRaw[], routes: string[]) => {
    let newRoute: RouteRecordRaw[] = []
    perRoute.forEach((item) => {
        if (routes.includes(item.name as string)) {
            if (item.children && item.children.length > 0) {
                newRoute.push(item)
                newRoute[newRoute.length - 1].children = filterRoute(item.children, routes)
            } else {
                newRoute.push(item)
            }
        }
    })
    return newRoute
}

let useUserStore = defineStore('User', {
    state: () => {
        return {
            token: TOKEN.getToken(),
            menuRoutes: <RouteRecordRaw[]>[],
            username: '',
            avatar: ''
        }
    },
    actions: {
        async userLogin(data: loginForm) {
            let result = await reqLogin(data)
            if (result.code === 200) {
                this.token = result.data
                TOKEN.setToken(result.data)
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }

        },
        async userInfo() {
            if(!this.token) return 'no token'
            let result = await reqUserInfo()
            if (result.code === 200) {
                this.username = result.data.name
                this.avatar = result.data.avatar
                //过滤用户权限路由
                let userRoute = filterRoute(permissionRoute, result.data.routes)
                this.menuRoutes = [...ConstantRoute, ...userRoute, ...anyRoute];

                //给路由对象添加路由
                [...userRoute, ...anyRoute].forEach((route) => {
                    router.addRoute(route)
                })
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        async userLogout() {
            let result = await reqLogout()
            if (result.code === 200) {
                this.token = ''
                this.username = ''
                this.avatar = ''
                TOKEN.removeToken()
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        }
    },
    getters: {

    }
})

export default useUserStore
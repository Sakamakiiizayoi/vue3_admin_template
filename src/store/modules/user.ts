//用户相关的小仓库
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user';
import { defineStore } from 'pinia';
import type { loginForm } from '@/api/user/type';
import { ConstantRoute } from '@/router/routes';

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

let useUserStore = defineStore('User', {
    state: () => {
        return {
            token: TOKEN.getToken(),
            menuRoutes: ConstantRoute,
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
            let result = await reqUserInfo()
            if (result.code === 200) {
                this.username = result.data.name
                this.avatar = result.data.avatar
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
//路由鉴权
import router from '@/router';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css'
import useUserStore from './store/modules/user';
import pinia from './store';
import setting from './setting';
nprogress.configure({ showSpinner: false }); //隐藏右上角加载圈
let userStore = useUserStore(pinia)
//路由守卫
//全局前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
    document.title = `${setting.title} - ${to.meta.title}`

    nprogress.start()//开启进度条
    //判断用户是否登录
    let token = userStore.token
    if (token) {
        //用户已登录
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            //判断是否有用户数据
            if (userStore.username) {
                next()
            } else {
                try {
                    await userStore.userInfo()
                    next()
                } catch (error: any) {
                    //获取用户信息失败：token过期等其他原因
                    ElNotification({
                        type: 'error',
                        title: '获取用户信息失败',
                        message: error+'或登录过期'
                    })
                    await userStore.userLogout()
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }
        }
    } else {
        //用户未登录
        if (to.path === '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
})

//全局后置守卫
router.afterEach((_to: any, _from: any) => {

    nprogress.done()//关闭进度条
})
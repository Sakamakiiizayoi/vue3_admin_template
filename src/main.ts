import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:svg-icons-register'
import router from './router'
import {
    HomeFilled, Platform, Lock,
    User, UserFilled, Monitor,
    Goods, ShoppingCartFull, ChromeFilled, Calendar, Orange,
    Refresh, FullScreen, Setting, ArrowDown, Plus, Edit, Delete, Check, View,
    InfoFilled, Top, Bottom, Sunny, Moon, TrendCharts, Tickets, Document, Memo,
    Postcard, List, Ticket, Present, DocumentChecked, CircleCheckFilled, CircleCloseFilled,
    Unlock
} from '@element-plus/icons-vue'//手动引入需要的图标
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import autoImportGC from '@/components'
//引入全局样式
import '@/styles/index.scss'
import 'element-plus/theme-chalk/dark/css-vars.css' //暗黑模式样式
import '@/permisstion'//应用路由鉴权
import pinia from './store'
import useUserStore from './store/modules/user'
import { isHasButton } from './directive/has'

const app = createApp(App)

let allIcon: { [x: string]: any } = {
    HomeFilled, Platform, Lock,
    User, UserFilled, Monitor,
    Goods, ShoppingCartFull, ChromeFilled, Calendar, Orange,
    Refresh, FullScreen, Setting, ArrowDown, Plus, Edit, Delete, Check, View,
    InfoFilled, Top, Bottom, Sunny, Moon, TrendCharts, Tickets, Document, Memo,
    Postcard, List, Ticket, Present, DocumentChecked, CircleCheckFilled, CircleCloseFilled,
    Unlock
};
//引入图标
Object.keys(allIcon).forEach((key) => {
    app.component(key, allIcon[key])
})

//安装自动导入本地组件插件
// app.use(autoImportGC)
//注册插件
app.use(pinia)
app.use(isHasButton)

let userStore = useUserStore()
userStore.userInfo().then(() => { //获取完用户信息后再注册路由组件和挂载app
    app.use(router)
    app.mount('#app')
}).catch(() => {
    app.use(router)
    app.mount('#app')
})


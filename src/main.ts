import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:svg-icons-register'
import router from './router'
import {
    HomeFilled, Platform, Lock,
    User, UserFilled, Monitor,
    Goods, ShoppingCartFull, ChromeFilled, Calendar, Orange,
    Refresh, FullScreen, Setting, ArrowDown, Plus, Edit, Delete, Check, View,
    InfoFilled, Top, Bottom
} from '@element-plus/icons-vue'//手动引入需要的图标
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import autoImportGC from '@/components'
//引入全局样式
import '@/styles/index.scss'
import '@/permisstion'//应用路由鉴权
import pinia from './store'

const app = createApp(App)


//安装自动导入本地组件插件
// app.use(autoImportGC)
//注册路由
app.use(router)
app.use(pinia)

let allIcon: { [x: string]: any } = {
    HomeFilled, Platform, Lock,
    User, UserFilled, Monitor,
    Goods, ShoppingCartFull, ChromeFilled, Calendar, Orange,
    Refresh, FullScreen, Setting, ArrowDown, Plus, Edit, Delete, Check, View,
    InfoFilled, Top, Bottom
};
//引入图标
Object.keys(allIcon).forEach((key) => {
    app.component(key, allIcon[key])
})

//注册所有图标组件
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     if (needIcon.includes(key)) { //只注册需要的图标
//         app.component(key, component)
//         // console.log(key);
//     }
// }

app.mount('#app')
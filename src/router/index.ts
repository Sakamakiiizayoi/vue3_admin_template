import { createRouter, createWebHistory } from 'vue-router'
import { ConstantRoute } from './routes';
let router = createRouter({
    history: createWebHistory(),
    routes: ConstantRoute,
    scrollBehavior() {// 滚动行为
        return {
            left: 0,
            top: 0
        }
    }
})

export default router
import pinia from '@/store';
import useUserStore from '@/store/modules/user';
let userStore = useUserStore(pinia)
export const isHasButton = (app: any) => {
    //自定义全局指令
    app.directive('has', { //按钮权限自定义指令
        mounted(el: Element, options: any){
            if(userStore.buttons.includes('btn.all')) return
            if (!userStore.buttons.includes(options.value)) {
                el.parentNode?.removeChild(el)
            }
        },
    })
}
import pinia from '@/store';
import useUserStore from '@/store/modules/user';
let userStore = useUserStore(pinia)
export const isHasButton = (app: any) => {
    //自定义全局指令
    app.directive('has', {
        mounted(el: Element, options: any){
            if (!userStore.buttons.includes(options.value)) {
                el.parentNode?.removeChild(el)
            }
        },
    })
}
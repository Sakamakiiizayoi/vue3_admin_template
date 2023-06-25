import { defineStore } from 'pinia';

const useLayoutSettingStore = defineStore('LayoutSetting', {
    state() {
        return {
            fold: false,
            refresh: false,
        }
    },
})

export default useLayoutSettingStore
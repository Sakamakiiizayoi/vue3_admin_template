import { defineStore } from 'pinia';
import { reqC1, reqC2, reqC3 } from '@/api/product/attr';
import type { CategoryState } from '@/api/product/attr/type'

const useCategoryStore = defineStore('Category', {
    state(): CategoryState {
        return {
            c1Arr: [],
            c1Id: undefined,
            c2Arr: [],
            c2Id: undefined,
            c3Arr: [],
            c3Id: undefined,
        }
    },
    actions: {
        async getC1() {
            let result = await reqC1()
            if (result.code === 200) {
                this.c1Arr = result.data
            }
        },
        async getC2() {
            let result = await reqC2(this.c1Id!)
            if(result.code === 200){
                this.c2Arr = result.data
            }
        },
        async getC3() {
            let result = await reqC3(this.c2Id!)
            if(result.code === 200){
                this.c3Arr = result.data
            }
        },
    }
})

export default useCategoryStore
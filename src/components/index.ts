import Pagination from '@/components/Pagination/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { App } from 'vue'

const allGC: { [key: string]: any } = {
    Pagination,
    SvgIcon
}

export default {
    install(app: App<Element>) {
        Object.keys(allGC).forEach((keys) => {
            app.component(keys, allGC[keys])
        })
    }
}
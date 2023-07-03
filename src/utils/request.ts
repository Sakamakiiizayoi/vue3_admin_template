//惊喜axios二次封装：使用请求与响应拦截器
import useUserStore from '@/store/modules/user'
import axios, { AxiosError } from 'axios'


let request = axios.create({
    baseURL: '/api',
    timeout: 5e3,
})

//请求修改
request.interceptors.request.use((config) => {
    //config配置对象
    let userStore = useUserStore()
    if (userStore.token) { //如果有token则让header携带token请求
        config.headers.token = userStore.token
    }

    return config
})

//响应修改
request.interceptors.response.use((response) => {
    //成功回调
    return response.data
}, (error: AxiosError) => {
    //失败回调
    let message = ''
    if (!error.response) {
        ElMessage({
            type: 'error',
            message: error.message
        })
        return Promise.reject(error)
    }
    let status = error.response.status
    switch (status) {
        case 401:
            message = 'TOKEN过期'
            break;
        case 403:
            message = '无权访问'
            break;
        case 404:
            message = '地址错误'
            break;
        case 500:
            message = '服务器错误'
            break;
        default:
            message = '网络出现问题'
            break;
    }
    ElMessage({
        type: 'error',
        message
    })
    return Promise.reject(error)
})

export default request
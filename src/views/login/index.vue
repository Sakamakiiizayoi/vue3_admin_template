<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <ElForm class="login_form" :model="loginForm" :rules="rules" ref="loginFormRef">
                    <ElFormItem>
                        <img src="/logo.gif" alt=""><h1>{{ setting.title }}</h1>
                    </ElFormItem>
                    <ElFormItem>
                        <h2>欢迎登录</h2>
                    </ElFormItem>

                    <ElFormItem prop="username">
                        <ElInput v-model="loginForm.username" :prefix-icon="User"></ElInput>
                    </ElFormItem>
                    <ElFormItem prop="password">
                        <ElInput v-model="loginForm.password" type="password" :prefix-icon="Lock" show-password></ElInput>
                    </ElFormItem>
                    <ElFormItem>
                        <ElButton :loading="loading" class="login_btn" type="primary" size="default" @click="login">登录
                        </ElButton>
                    </ElFormItem>
                </ElForm>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import userUserStore from '@/store/modules/user';
import { useRouter, useRoute } from 'vue-router';
import { getTime } from '@/utils/time';
import type { FormInstance, FormRules } from 'element-plus';
import setting from '@/setting';

let $router = useRouter()
let $route = useRoute()
let loading = ref(false)
let loginFormRef = ref<FormInstance>()

let loginForm = reactive({
    username: 'admin',
    password: 'atguigu123'
})

let useStore = userUserStore()

//登录方法
const login = async () => {
    //表单校验
    let validate = await loginFormRef.value!.validate().catch((_error) => {
        // console.log(`表单验证不通过`, error)
        return false
    })
    // console.log('表单验证：',validate);

    if (!validate) return //验证不通过则返回

    //登录请求
    loading.value = true
    useStore.userLogin(loginForm).then(() => {
        //执行登录成功后
        loading.value = false
        //跳转到首页
        let redirect: any = $route.query.redirect
        $router.push({ path: redirect || '/' })
        //登录提示信息
        ElNotification({
            type: 'success',
            message: '欢迎回来',
            title: `Hi，${getTime()}好`
        })
    }).catch((error) => {
        //执行登录出错失败后
        loading.value = false
        ElNotification({
            type: 'error',
            message: error.message
        })
    })
}

//自定义校验规则
const validatorPassword = (_rule: any, value: string, callback: any) => {
    if (value.length >= 6) {
        callback()
    } else {
        callback(new Error('密码至少为6位'))
    }
}
//表单校验规则
const rules = reactive<FormRules>({
    username: [
        { required: true, min: 5, max: 10, message: '账号长度应为5-10位', trigger: 'blur' },
    ],
    password: [
        // { required: true, min: 6, max: 15, message: '密码长度应为6-15位', trigger: 'blur' },
        { trigger: 'change', validator: validatorPassword }
    ]
})



</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('/bg.jpg') no-repeat;
    background-size: cover;

    .login_form {
        padding: 20px;
        width: 80%;
        max-width: 500px;
        position: relative;
        top: 30vh;
        border-radius: 5px;
        background-color: rgb(144 144 195 / 30%);

        h1 {
            font-size: 40px;
            color: white;
            height: 50px;
            line-height: 50px;
        }

        img{
            width: 50px;
            height: 50px;
        }

        h2 {
            font-size: 20px;
            color: white;
        }

        .login_btn {
            width: 100%;
        }
    }
}
</style>
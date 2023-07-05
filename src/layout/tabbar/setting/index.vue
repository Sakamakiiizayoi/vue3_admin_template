<template>
    <ElButton title="刷新" type="default" color="" icon="Refresh" circle @click="refresh"></ElButton>
    <ElButton title="全屏" type="default" icon="FullScreen" circle @click="fullScreen"></ElButton>

    <ElPopover placement="bottom" title="主题设置" trigger="click">
        <ElForm>
            <ElFormItem label="主题颜色">
                <el-color-picker @change="changeColor" v-model="color" show-alpha :predefine="predefineColors" />
            </ElFormItem>
            <ElFormItem label="黑暗模式">
                <el-switch v-model="darkModel" style="--el-switch-on-color: #353535; --el-switch-off-color: #409EFF"
                    inline-prompt active-icon="Moon" inactive-icon="Sunny" @change="changeDark" />
            </ElFormItem>
        </ElForm>
        <template #reference>
            <ElButton title="设置" type="default" icon="Setting" circle></ElButton>
        </template>
    </ElPopover>
    <ElImage style="width: 30px;height: 30px; margin:0 10px;border-radius: 50%;" :src="userStore.avatar" fit="cover">
    </ElImage>
    <el-dropdown>
        <span class="el-dropdown-link">
            {{ userStore.username }}
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting';
import useUserStore from '@/store/modules/user';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';

let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()
let layoutSettingStore = useLayoutSettingStore()

/**
 * 刷新按钮回调
 */
const refresh = () => {
    layoutSettingStore.refresh = !layoutSettingStore.refresh
}

/**
 * 全屏按钮回调
 */
const fullScreen = () => {
    let full = document.fullscreenElement
    if (!full) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

/**
 * 登出按钮回调
 */
const logout = async () => {
    await userStore.userLogout()
    $router.push({ path: '/login', query: { redirect: $route.path } })
}

//#region 主题颜色选择相关
const color = ref('')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])
const darkModel = ref(false)

/**
 * 切换暗黑模式
 */
const changeDark = () => {
    let html = document.documentElement
    darkModel.value ? html.className = 'dark' : html.className = ''
}

/**
 * 切换主题颜色
 */
const changeColor = () => {
    let html = document.documentElement
    html.style.setProperty('--el-color-primary', color.value)
    localColor.set()
}

/**
 * 本地存储主题颜色
 */
const localColor = {
    get() {
        color.value = localStorage.getItem('THEMECOLOR') || ''
    },
    set() {
        localStorage.setItem('THEMECOLOR', color.value)
    }
}
onMounted(() => {
    localColor.get()
    changeColor()
})
//#endregion 颜色选择相关
</script>

<style scoped lang="">

</style>
<template>
    <ElButton type="default" color="" icon="Refresh" circle @click="refresh"></ElButton>
    <ElButton type="default" icon="FullScreen" circle @click="fullScreen"></ElButton>
    <ElButton type="default" icon="Setting" circle></ElButton>
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

let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()
let layoutSettingStore = useLayoutSettingStore()

const refresh = () => {
    layoutSettingStore.refresh = !layoutSettingStore.refresh
}

const fullScreen = () => {
    let full = document.fullscreenElement
    if (!full) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

const logout = async () => {
    await userStore.userLogout()
    $router.push({ path: '/login', query: { redirect: $route.path } })
}

</script>

<style scoped lang="">

</style>
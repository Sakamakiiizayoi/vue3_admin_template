<template>
    <div class="layout_container">
        <div class="layout_slider" :class="layoutSettingStore.fold ? 'fold' : ''">
            <Logo></Logo>
            <el-scrollbar class="scrollbar">
                <ElMenu :router="true" :default-active="$router.path"
                    :collapse="layoutSettingStore.fold" :collapse-transition="false">
                    <Menu :menuList="userStore.menuRoutes"></Menu>
                </ElMenu>
            </el-scrollbar>
        </div>
        <div class="layout_tabbar" :class="layoutSettingStore.fold ? 'fold' : ''">
            <Tabbar></Tabbar>
        </div>
        <div class="layout_main" :class="layoutSettingStore.fold ? 'fold' : ''">
            <Main></Main>
        </div>
    </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue';
import Menu from './menu/index.vue';
import Main from './main/index.vue';
import Tabbar from './tabbar/index.vue';
import { useRoute } from 'vue-router';
import useUserStore from '@/store/modules/user';
import useLayoutSettingStore from '@/store/modules/setting';

let userStore = useUserStore()
let layoutSettingStore = useLayoutSettingStore()
let $router = useRoute()
</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
        // background-color: #001529;
        width: $base-menu-width;
        height: 100vh;
        transition: width .3s;
        border-right: 1px solid var(--el-border-color);
        .scrollbar {
            height: calc(100vh - 50px);

            .el-menu {
                border-right: none;
            }
        }

        &.fold {
            width: $base-menu-min-width;
        }
    }

    .layout_tabbar {
        // background-color: aqua;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        transition: width .3s;
        position: fixed;
        top: 0px;
        right: 0px;

        &.fold {
            width: calc(100% - $base-menu-min-width);
        }
    }

    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        // background-color: rgb(127, 255, 127);
        top: $base-tabbar-height;
        right: 0px;
        padding: 20px;
        overflow: auto;
        transition: width .3s;

        &.fold {
            width: calc(100% - $base-menu-min-width);
        }
    }
}
</style>
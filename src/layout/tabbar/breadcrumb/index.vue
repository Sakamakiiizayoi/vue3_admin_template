<template>
    <ElButton text :icon="layoutSettingStore.fold ? Expand : Fold" @click="changeIcon"></ElButton>
    <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item, index) in $router.matched" :key="index" v-show="item.meta.title" :to="item.path">
            <div class="title">
                <ElIcon>
                    <component :is="item.meta.icon"></component>
                </ElIcon>
                <span>{{ item.meta.title }}</span>
            </div>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue';
import useLayoutSettingStore from '@/store/modules/setting';
import { useRoute } from 'vue-router';
let $router = useRoute()
let layoutSettingStore = useLayoutSettingStore()

const changeIcon = () => {
    layoutSettingStore.fold = !layoutSettingStore.fold
}

</script>

<style scoped lang="scss">
.el-button {
    height: 100%;
}

.title {
    display: flex;
    align-items: center;
    span{
        margin-left: 5px;
    }
}
</style>
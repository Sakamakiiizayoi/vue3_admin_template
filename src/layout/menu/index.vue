<template>
    <template v-for="(item, _index) in data" :key="item.path">
        <!-- 没有children -->
        <ElMenuItem v-if="!item.children && !item.meta!.hidden" :index="item.path">
            <ElIcon v-if="item.meta!.icon">
                <component :is="item.meta!.icon"></component>
            </ElIcon>
            <span>{{ item.meta!.title }}</span>
        </ElMenuItem>
        <!-- 有children但是只有一个 -->
        <ElMenuItem v-if="item.children && item.children.length === 1 && !item.meta!.hidden" :index="item.children[0].path">
            <ElIcon v-if="item.children[0].meta!.icon">
                <component :is="item.children[0].meta!.icon"></component>
            </ElIcon>
            <span>{{ item.children[0].meta!.title }}</span>
        </ElMenuItem>
        <!-- 有children且大于1 -->
        <ElSubMenu v-if="item.children && item.children.length > 1 && !item.meta!.hidden" :index="item.path">
            <template #title>
                <ElIcon v-if="item.meta!.icon">
                    <component :is="item.meta!.icon"></component>
                </ElIcon>
                <span>{{ item.meta!.title }}</span>
            </template>
            <Menu :menuList="item.children"></Menu>
        </ElSubMenu>
    </template>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router';

const props = defineProps(['menuList'])
let data: RouteRecordRaw[] = props.menuList

</script>
<script lang="ts">
export default {
    name: 'Menu'
}
</script>

<style scoped lang="scss"></style>
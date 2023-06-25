<template>
    <div class="tabbar">
        <div class="tabbar_left">
            <Breadcrumb></Breadcrumb>
        </div>
        <div class="tabbar_right">
            <Setting></Setting>
        </div>
    </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue';
import Setting from './setting/index.vue';
</script>

<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    background-color: white;
    justify-content: space-between;
    border-bottom: 1px solid #DCDFE6;
    .tabbar_left {
        display: flex;
        align-items: center;
    }
    .tabbar_right{
        display: flex;
        align-items: center;
    }
}
</style>
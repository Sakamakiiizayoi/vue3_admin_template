<template>
    <div class="logo">
        <img src="/logo.gif" alt="">
        <el-text truncated class="text">{{setting.title}}</el-text>
    </div>
</template>

<script setup lang="ts">
import setting from '@/setting';
</script>

<style scoped lang="scss">
.logo {
    display: flex;
    align-items: center;
    justify-content: left;
    color: #303133;
    font-weight: 600;
    width: 100%;

    img {
        width: 50px;
        height: 50px;
        margin-left: 8px;
    }

    .text{
        width: 150px;
        margin-left: 20px;
        text-align: center;
        font-size: 20px;
    }
}
</style>
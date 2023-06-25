<template>
    <div class="logo">
        <img src="/logo.gif" alt="">
        <p>{{setting.title}}</p>
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
    color: white;
    font-weight: 600;
    width: 100%;

    img {
        width: 50px;
        height: 50px;
        margin-left: 8px;
    }

    p {
        font-size: 20px;
        margin-left: 10px;
        white-space: nowrap;
    }

}
</style>
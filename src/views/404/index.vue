<template>
    <div class="container">
        <svg-icon name="404" width="500px" height="500px"></svg-icon>
        <div class="des">
            <ElText class="tip">未找到此页面或无权查看</ElText>
            <div style="margin-top: 10px;">
                <el-link type="primary" @click="router.push({ name: 'Home' })">返回首页</el-link>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
let router = useRouter()
</script>
<style lang="scss">
.container {
    display: flex;
    justify-content: center;

    .des {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .tip {
            font-size: 26px;
            font-weight: 600;
        }
    }
}
</style>
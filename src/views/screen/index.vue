<template>
    <div class="container">
        <div id="box">

        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

//#region 窗口缩放变换相关
const getScale = (w = 1920, h = 1080) => {
    let ww = window.innerWidth / w
    let wh = window.innerHeight / h
    return ww < wh ? ww : wh
}

onMounted(() => {
    let box = document.getElementById('box')!;
    box.style.setProperty('transform', `scale(${getScale()}) translate(-50%, -50%)`)

    window.onresize = () => {
        box.style.setProperty('transform', `scale(${getScale()}) translate(-50%, -50%)`)
    }
})
//#endregion 窗口缩放变换相关
</script>

<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;
    background: url('mbk.png') no-repeat center;
    background-size: cover;
    overflow: hidden;

    #box {
        width: 1920px;
        height: 1080px;
        background-color: antiquewhite;
        transform-origin: left top;
        transform: scale(1);
        position: fixed;
        left: 50%;
        top: 50%;
    }
}
</style>
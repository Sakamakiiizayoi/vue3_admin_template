<template>
    <router-view #="{ Component }">
        <transition name="fade">
            <component :is="Component" v-if="flag"></component>
        </transition>
    </router-view>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting';
import { nextTick, ref, watch } from 'vue';
let flag = ref(true)
let layoutSettingStore = useLayoutSettingStore()

watch(() => layoutSettingStore.refresh, () => {
    flag.value = false
    nextTick(() => {
        flag.value = true
    })
})

</script>

<style scoped lang="scss">
.fade-enter-from {
    opacity: 0;
}

.fade-enter-active {
    transition: opacity .3s ease;
}

.fade-enter-to {
    opacity: 1;
}

.fade-leave-from {
    display: none;
}

.fade-leave-active {
    display: none;
}

.fade-leave-to {
    display: none;
}
</style>
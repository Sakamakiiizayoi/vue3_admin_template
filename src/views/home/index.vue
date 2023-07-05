<template>
    <div>
        <ElCard>
            <div class="box">
                <ElImage :src="userStore.avatar" style="border-radius: 50%; width:100px; height: 100px;" fit="cover">
                </ElImage>
                <div class="text">
                    <div class="title">{{ getTime() }}好 {{ userStore.username }}</div>
                    <el-text class="des" type="info">{{ setting.title }}</el-text>
                </div>
            </div>
        </ElCard>
        <div class="bottom">
            <svg-icon name="welcome" width="700px" height="500px"></svg-icon>
        </div>
    </div>
</template>
<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';
import setting from '@/setting'
let userStore = useUserStore()
</script>
<style lang="scss">
.box {
    display: flex;

    .text {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 20px;

        .title {
            font-size: 26px;
            font-weight: 600;
        }

        .des {
            font-size: 16px;
            font-style: italic;
        }
    }
}

.bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
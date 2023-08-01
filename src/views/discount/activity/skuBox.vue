<template>
    <div class="skuBox" :title="skuInfo.skuName">
        <ElImage style="width: 100%;" :src="skuInfo.skuDefaultImg" fit="cover"></ElImage>
        <div class="name">{{ skuInfo.skuName }}</div>
        <ElButton v-if="$attrs.add" class="inline" size="small" type="success" icon="Plus" @click="addHandler"></ElButton>
        <ElButton v-if="$attrs.delete" class="inline" size="small" type="danger" icon="Delete" @click="deleteHandler">
        </ElButton>
    </div>
</template>

<script setup lang="ts">
import type { SkuInfo } from '@/api/discount/activity/type';
defineProps<{
    skuInfo: SkuInfo
}>()
const emit = defineEmits(['add', 'delete'])

const addHandler = () => {
    emit('add')
}

const deleteHandler = () => {
    emit('delete')
}

</script>

<style scoped lang="scss">
.skuBox {
    width: 100px;
    border: 1px solid #CDD0D6;
    border-radius: 5px;
    background-color: #F0F2F5;
    overflow: hidden;
    display: inline-block;
    // margin: 0 10px 10px 0;

    .inline {
        width: 100%;
        margin: 0;
        border-radius: unset;
    }

    .name {
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
}
</style>
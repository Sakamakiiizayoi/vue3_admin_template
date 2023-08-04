<template>
    <div class="Box" :title="trademark.tmName">
        <ElImage style="width: 98px; height: 98px;" :src="trademark.logoUrl" fit="contain"></ElImage>
        <div class="name">{{ trademark.tmName }}</div>
        <ElButton v-if="$attrs.add" class="inline" size="small" type="success" icon="Plus" @click="addHandler"></ElButton>
        <ElButton v-if="$attrs.delete" class="inline" size="small" type="danger" icon="Delete" @click="deleteHandler">
        </ElButton>
    </div>
</template>

<script setup lang="ts">
import type { Trademark } from '@/api/product/trademark/type';
defineProps<{
    trademark: Trademark
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
.Box {
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
        text-align: center;
    }
}
</style>
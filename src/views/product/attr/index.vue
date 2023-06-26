<template>
    <div>
        <Category />
        <el-card style="margin-top: 10px;">
            <ElButton type="primary" icon="Plus" @click="" :disabled="categoryStore.c3Id ? false : true">添加属性</ElButton>
            <ElTable :border="true" class="table">
                <ElTableColumn label="序号" width="80px" align="center" type="index"></ElTableColumn>
                <ElTableColumn label="属性名称" width="120px">

                </ElTableColumn>
                <ElTableColumn label="属性值名称">

                </ElTableColumn>
                <ElTableColumn label="操作" width="120px">

                </ElTableColumn>
            </ElTable>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category';
let categoryStore = useCategoryStore()


</script>

<style scoped lang="scss">
.table {
    margin-top: 10px;
}
</style>
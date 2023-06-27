<template>
    <div>
        <Category :scene="scene"></Category>
        <ElCard style="margin-top: 10px;">
            <ElButton type="primary" icon="Plus" @click="">
                添加SPU
            </ElButton>
            <ElTable :border="true" class="table">
                <ElTableColumn label="序号" width="80px" align="center" type="index"></ElTableColumn>
                <ElTableColumn label="SPU名称">

                </ElTableColumn>
                <ElTableColumn label="SPU描述">

                </ElTableColumn>
                <ElTableColumn label="SPU操作">

                </ElTableColumn>
            </ElTable>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="40"
                @current-change="" @size-change="" />
        </ElCard>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
let scene = ref(0)
let pageNo = ref(1)
let limit = ref(3)
</script>

<style scoped>
.table {
    margin: 10px 0;
}
</style>
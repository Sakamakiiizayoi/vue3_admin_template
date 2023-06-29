<template>
    <div>
        <Category :scene="scene"></Category>
        <ElCard style="margin-top: 10px;">
            <div v-show="scene === 0">
                <ElButton type="primary" icon="Plus" @click="addSpu" :disabled="categoryStore.c3Id ? false : true">
                    添加SPU
                </ElButton>
                <ElTable v-loading="loading" :border="true" class="table" :data="records">
                    <ElTableColumn label="序号" width="80px" align="center" type="index"></ElTableColumn>
                    <ElTableColumn label="SPU名称" prop="spuName"></ElTableColumn>
                    <ElTableColumn label="SPU描述" prop="description" show-overflow-tooltip></ElTableColumn>
                    <ElTableColumn label="SPU操作">
                        <template #="{ row }">
                            <ElButton type="primary" size="small" icon="Plus" title="添加SKU"></ElButton>
                            <ElButton type="warning" size="small" icon="Edit" title="修改SPU" @click="updateSpu(row)"></ElButton>
                            <ElButton type="info" size="small" icon="View" title="查看SKU列表"></ElButton>
                            <ElButton type="danger" size="small" icon="Delete" title="删除SPU"></ElButton>
                        </template>
                    </ElTableColumn>
                </ElTable>
                <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
                    :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                    @current-change="getHasSpu" @size-change="sizeChange" />
            </div>
            <SpuForm ref="spuFormRef" v-show="scene === 1" @changeScene="changeScene"></SpuForm>
            <SkuForm v-show="scene === 2" @changeScene="changeScene"></SkuForm>
        </ElCard>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import useCategoryStore from '@/store/modules/category';
import { reqHasSpu } from '@/api/product/spu';
import type { Records } from '@/api/product/spu/type';
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'

let scene = ref(0)
let pageNo = ref(1)
let limit = ref(3)
let total = ref(0)
let loading = ref(false)
let spuFormRef = ref<any>(null)
let categoryStore = useCategoryStore()
let records = ref<Records>([])

watch(() => categoryStore.c3Id, () => {
    if (categoryStore.c3Id) {
        getHasSpu()

    } else {
        records.value = []
    }
})

let getHasSpu = async (page = 1) => {
    pageNo.value = page
    loading.value = true
    let result = await reqHasSpu(pageNo.value, limit.value, categoryStore.c3Id!)
    loading.value = false
    if (result.code === 200) {
        records.value = result.data.records
        total.value = result.data.total
    }
}

const sizeChange = () => {
    getHasSpu(1)
}

const changeScene = (id: number) => {
    scene.value = id
}

const addSpu = () => {
    scene.value = 1
}

const updateSpu = (row: any) => {
    scene.value = 1
    spuFormRef.value!.initHasSpuData(row)
}
</script>

<style scoped>
.table {
    margin: 10px 0;
}
</style>
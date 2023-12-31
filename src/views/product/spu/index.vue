<template>
    <div>
        <Category :scene="scene"></Category>
        <ElCard style="margin-top: 10px;">
            <div v-show="scene === 0">
                <ElButton type="primary" icon="Plus" @click="addSpu" :disabled="categoryStore.c3Id ? false : true" v-has="'btn.Spu.add'">
                    添加SPU
                </ElButton>
                <ElTable v-loading="loading" :border="true" class="table" :data="records">
                    <ElTableColumn label="序号" width="80px" align="center" type="index"></ElTableColumn>
                    <ElTableColumn label="SPU名称" prop="spuName"></ElTableColumn>
                    <ElTableColumn label="SPU描述" prop="description" show-overflow-tooltip></ElTableColumn>
                    <ElTableColumn label="SPU操作">
                        <template #="{ row }">
                            <ElButton type="primary" size="small" icon="Plus" title="添加SKU" @click="addSku(row)" v-has="'btn.Sku.add'"></ElButton>
                            <ElButton type="warning" size="small" icon="Edit" title="修改SPU" @click="updateSpu(row)" v-has="'btn.Spu.update'">
                            </ElButton>
                            <ElButton type="info" size="small" icon="View" title="查看SKU列表" @click="showSkuList(row)">
                            </ElButton>
                            <ElPopconfirm :title="`确认删除${row.spuName}SPU？`" width="250px" icon="Delete"
                                @confirm="deleteSpu(row.id)">
                                <template #reference>
                                    <ElButton type="danger" size="small" icon="Delete" title="删除SPU" v-has="'btn.Spu.remove'"></ElButton>
                                </template>
                            </ElPopconfirm>
                        </template>
                    </ElTableColumn>
                </ElTable>
                <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
                    :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                    @current-change="getHasSpu" @size-change="sizeChange" />
            </div>
            <SpuForm ref="spuFormRef" v-show="scene === 1" @changeScene="changeScene"></SpuForm>
            <SkuForm ref="skuFormRef" v-show="scene === 2" @changeScene="changeScene"></SkuForm>
            <ElDialog v-model="skuListShow" title="SKU列表">
                <ElTable border :data="skuArr" v-loading="skuLoading">
                    <ElTableColumn label="SKU名字" prop="skuName"></ElTableColumn>
                    <ElTableColumn label="SKU价格" prop="price"></ElTableColumn>
                    <ElTableColumn label="SKU重量" prop="weight"></ElTableColumn>
                    <ElTableColumn label="SKU图片">
                        <template #="{ row }">
                            <ElImage style="width: 100px;" :src="row.skuDefaultImg"></ElImage>
                        </template>
                    </ElTableColumn>
                </ElTable>
            </ElDialog>
        </ElCard>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import useCategoryStore from '@/store/modules/category';
import { reqHasSpu, reqGetSkuList, reqDeleteSpu } from '@/api/product/spu';
import type { Records, SkuData, SpuData } from '@/api/product/spu/type';
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'

let scene = ref(0)
let pageNo = ref(1)
let limit = ref(3)
let total = ref(0)
let loading = ref(false)
let spuFormRef = ref<any>(null)
let skuFormRef = ref<any>(null)
let categoryStore = useCategoryStore()
let records = ref<Records>([])

/**
 * 监视三级分类id变化
 */
watch(() => categoryStore.c3Id, () => {
    if (categoryStore.c3Id) {
        getHasSpu()

    } else {
        records.value = []
    }
})

/**
 * 卸载前执行
 */
onBeforeUnmount(() => {
    categoryStore.$reset()
})

/**
 * 重新获取第几页的数据
 * @param page 
 */
let getHasSpu = async (page = 1) => {
    if (page <= 0) page = 1
    pageNo.value = page
    loading.value = true
    let result = await reqHasSpu(pageNo.value, limit.value, categoryStore.c3Id!)
    loading.value = false
    if (result.code === 200) {
        records.value = result.data.records
        total.value = result.data.total
    }
}

/**
 * 分页大小改变回调
 */
const sizeChange = () => {
    getHasSpu(1)
}

/**
 * 切换场景
 * @param id 
 */
const changeScene = (id: number, stay = true, update = true) => {
    scene.value = id
    if (id === 0 && update) {
        if (stay) {
            getHasSpu(pageNo.value)
        } else {
            getHasSpu()
        }
    }
}

/**
 * 添加spu按钮回调
 */
const addSpu = () => {
    scene.value = 1
    spuFormRef.value!.initAddSpuData(categoryStore.c3Id)
}

/**
 * 更新spu按钮回调
 * @param row 
 */
const updateSpu = (row: any) => {
    scene.value = 1
    spuFormRef.value!.initHasSpuData(row)
}

/**
 * 添加sku按钮回调
 */
const addSku = (row: SpuData) => {
    scene.value = 2
    skuFormRef.value!.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

let skuListShow = ref(false)
let skuLoading = ref(false)
let skuArr = ref<SkuData[]>([])
/**
 * 查看sku按钮回调
 * @param row 
 */
const showSkuList = async (row: SkuData) => {
    skuListShow.value = true
    skuArr.value = []
    skuLoading.value = true
    let result = await reqGetSkuList(row.id!)
    skuLoading.value = false
    if (result.code === 200) {
        skuArr.value = result.data
    } else {
        ElMessage.error('获取SKU列表失败：' + result.message)
    }
}

/**
 * 删除spu按钮回调
 * @param spuId 
 */
const deleteSpu = async (spuId: number) => {
    let result = await reqDeleteSpu(spuId)
    if (result.code === 200) {
        ElMessage.success('删除成功！')
        getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage.error(`删除失败：${result.message}|${result.data}`)
    }
}
</script>

<style scoped>
.table {
    margin: 10px 0;
}
</style>
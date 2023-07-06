<template>
    <ElCard>
        <ElTable v-loading="loading" style="margin-bottom: 10px;" :data="skuArr">
            <ElTableColumn label="序号" type="index" align="center" width="80px"></ElTableColumn>
            <ElTableColumn label="名称" width="150px" show-overflow-tooltip prop="skuName"></ElTableColumn>
            <ElTableColumn label="描述" show-overflow-tooltip prop="skuDesc"></ElTableColumn>
            <ElTableColumn label="图片" width="150px" show-overflow-tooltip prop="skuName">
                <template #="{ row }">
                    <ElImage style="width: 100px;" :src="row.skuDefaultImg"></ElImage>
                </template>
            </ElTableColumn>
            <ElTableColumn label="重量" width="150px" show-overflow-tooltip prop="weight"></ElTableColumn>
            <ElTableColumn label="价格" width="150px" show-overflow-tooltip prop="price"></ElTableColumn>
            <ElTableColumn label="操作" width="250px" show-overflow-tooltip fixed="right">
                <template #="{ row }">
                    <ElButton size="small" :type="row.isSale === 0 ? 'success' : 'primary'"
                        :icon="row.isSale === 0 ? 'Top' : 'Bottom'" @click="updateSale(row)" v-has="'btn.Sku.updown'"></ElButton>
                    <ElButton size="small" type="warning" icon="Edit" @click="edit" v-has="'btn.Sku.update'"></ElButton>
                    <ElButton size="small" type="info" icon="InfoFilled" @click="findSku(row)"></ElButton>
                    <ElPopconfirm :title="`确认删除${row.skuName}品牌？`" width="250px" icon="Delete" @confirm="deleteSku(row)">
                        <template #reference>
                            <ElButton size="small" type="danger" icon="Delete" v-has="'btn.Sku.remove'"></ElButton>
                        </template>
                    </ElPopconfirm>

                </template>
            </ElTableColumn>
        </ElTable>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
            layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasSku"
            @size-change="sizeChange" />
        <!-- 抽屉组件 -->
        <ElDrawer v-model="drawer" title="查看商品详情" :size="500">
            <div v-loading="drawerLoading" class="dt">
                <ElRow>
                    <ElCol :span="5">名称</ElCol>
                    <ElCol :span="19">{{ skuDetailData?.skuName }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">描述</ElCol>
                    <ElCol :span="19">{{ skuDetailData?.skuDesc }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">价格</ElCol>
                    <ElCol :span="19">{{ skuDetailData?.price }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">平台属性</ElCol>
                    <ElCol :span="19">
                        <ElTag style="margin-left: 5px;" v-for="(attrValue, _index) in skuDetailData?.skuAttrValueList"
                            :key="attrValue.id">{{
                                attrValue.valueName }}</ElTag>
                    </ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">销售属性</ElCol>
                    <ElCol :span="19">
                        <ElCol :span="16">
                            <ElTag type="success" style="margin-left: 5px;"
                                v-for="(saleAttrValue, _index) in skuDetailData?.skuSaleAttrValueList"
                                :key="saleAttrValue.id">{{
                                    saleAttrValue.saleAttrValueName }}</ElTag>
                        </ElCol>
                    </ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">商品图片</ElCol>
                    <ElCol :span="19">
                        <el-carousel :interval="4000" type="card" height="200px">
                            <el-carousel-item v-for="(img, _index) in skuDetailData?.skuImageList" :key="img.id">
                                <ElImage style="width: 100%;" :src="img.imgUrl"></ElImage>
                            </el-carousel-item>
                        </el-carousel>
                    </ElCol>
                </ElRow>
            </div>
        </ElDrawer>
    </ElCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { reqSkuList, reqCancelSku, reqSaleSku, reqGetSkuById, reqDeleteSkuById } from '@/api/product/sku';
import type { SkuData } from '@/api/product/sku/type';

let loading = ref(false)
let drawerLoading = ref(false)
let drawer = ref(false)
let pageNo = ref(1)
let limit = ref(3)
let total = ref(0)
let skuArr = ref<SkuData[]>([])
let skuDetailData = ref<SkuData>()

onMounted(() => {
    getHasSku()
})

/**
 * 获取商品分页信息
 * @param page 
 */
const getHasSku = async (page = 1) => {
    if (page <= 0) page = 1
    pageNo.value = page
    loading.value = true
    let result = await reqSkuList(pageNo.value, limit.value)
    loading.value = false
    if (result.code === 200) {
        skuArr.value = result.data.records
        total.value = result.data.total
    }
}

/**
 * 分页数量改变回调
 * @param pageSize 
 */
const sizeChange = (pageSize: number) => {
    limit.value = pageSize
    getHasSku()
}

/**
 * 商品的商家与下架
 * @param row 
 */
const updateSale = async (row: SkuData) => {
    let result
    if (row.isSale === 1) {
        result = await reqCancelSku(row.id!)
        if (result.code === 200) {
            ElMessage.success('下架成功')
            row.isSale = 0
        }
    } else {
        result = await reqSaleSku(row.id!)
        if (result.code === 200) {
            ElMessage.success('上架成功')
            row.isSale = 1
        }
    }
}

/**
 * 编辑按钮回调
 */
const edit = () => {
    ElMessage.info('开发中。。。')
}

/**
 * 查看按钮回调
 */
const findSku = async (row: SkuData) => {
    drawer.value = true
    drawerLoading.value = true
    let result = await reqGetSkuById(row.id!)
    drawerLoading.value = false
    if (result.code === 200) {
        skuDetailData.value = result.data
    } else {
        ElMessage.error('获取商品详情错误')
    }
}

const deleteSku = async (row: SkuData) => {
    let result = await reqDeleteSkuById(row.id!)
    if (result.code === 200) {
        ElMessage.success('删除成功')
        getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage.error(`删除失败：${result.message}|${result.data}`)
    }
}
</script>

<style scoped lang="scss">
.dt {
    div {
        margin-bottom: 10px;
    }
}
</style>
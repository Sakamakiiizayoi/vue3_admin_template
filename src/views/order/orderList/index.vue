<template>
    <div>
        <ElCard style="height: 75px;">
            <ElForm :inline="true" class="search" @submit.native.prevent>
                <ElFormItem label="收货人:">
                    <ElInput placeholder="请输入姓名搜索" v-model="keyword" @keydown.enter="search"></ElInput>
                </ElFormItem>
                <ElFormItem>
                    <ElButton type="primary" @click="search">搜索</ElButton>
                    <ElButton @click="reset">重置</ElButton>
                </ElFormItem>
            </ElForm>
        </ElCard>
        <ElCard style="margin-top: 10px;">
            <ElTable v-loading="tableLoading" border style="margin: 10px 0;" :data="orderArr">
                <ElTableColumn label="ID" prop="id"></ElTableColumn>
                <ElTableColumn label="收货人" prop="consignee"></ElTableColumn>
                <ElTableColumn label="收货人手机号" prop="consigneeTel"></ElTableColumn>
                <ElTableColumn label="总金额" prop="totalAmount"></ElTableColumn>
                <ElTableColumn label="付款方式" prop="paymentWay"></ElTableColumn>
                <ElTableColumn label="收货地址" prop="deliveryAddress" show-overflow-tooltip></ElTableColumn>
                <ElTableColumn label="备注" prop="orderComment"></ElTableColumn>
                <ElTableColumn label="订单编号" prop="outTradeNo" width="170px"></ElTableColumn>
                <ElTableColumn label="创建时间" prop="createTime" width="170px"></ElTableColumn>
                <ElTableColumn label="操作时间" prop="operateTime" width="170px"></ElTableColumn>
                <ElTableColumn label="过期时间" prop="expireTime" width="170px"></ElTableColumn>
                <ElTableColumn label="状态" prop="orderStatusName"></ElTableColumn>
                <ElTableColumn label="订单详情列表" fixed="right" width="430px">
                    <template #="{ row }">
                        <div style="margin-top: 15px" v-for="(item, index) in row.orderDetailList" :key="index">
                            <el-badge :value="'x' + item.skuNum" class="item">
                                <div class="text-overflow" @click="findSku(item)">{{ item.skuName }}</div>
                            </el-badge>
                        </div>
                    </template>
                </ElTableColumn>
            </ElTable>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[5, 7, 9, 11]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                @current-change="getHasOrder" @size-change="sizeChange" />
        </ElCard>
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
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { reqOrderPage } from '@/api/order/orderList/index';
import type { Order, OrderDetail } from '@/api/order/orderList/type';
import { reqGetSkuById } from '@/api/product/sku';
import { SkuData } from '@/api/product/sku/type';

//#region 分页列表展示相关
let tableLoading = ref(false)
let pageNo = ref(1)
let limit = ref(5)
let total = ref(0)
let orderArr = ref<Order[]>([])

onMounted(() => {
    getHasOrder()
})

/**
 * 获取用户分页列表
 * @param page 
 */
const getHasOrder = async (page = 1) => {
    pageNo.value = page
    tableLoading.value = true
    let result = await reqOrderPage(pageNo.value, limit.value, keyword.value)
    tableLoading.value = false
    if (result.code === 200) {
        orderArr.value = result.data.records
        total.value = result.data.total
    }
}

/**
 * 分页数量改变回调
 * @param pageSize 
 */
const sizeChange = (pageSize: number) => {
    limit.value = pageSize
    getHasOrder()
}
//#endregion 分页列表展示相关

//#region 搜索栏相关
const keyword = ref('')

const search = () => {
    getHasOrder()
}

const reset = () => {
    keyword.value = ''
    getHasOrder()
}
//#endregion 搜索相关

//#region 显示sku详情相关
const drawer = ref(false)
const drawerLoading = ref(false)
let skuDetailData = ref<SkuData>()
/**
 * 查看sku详情
 * @param row 
 */
const findSku = async (row: OrderDetail) => {
    drawer.value = true
    drawerLoading.value = true
    let result = await reqGetSkuById(row.skuId)
    drawerLoading.value = false
    if (result.code === 200) {
        skuDetailData.value = result.data
    } else {
        ElMessage.error('获取商品详情错误')
    }
}
//#endregion 显示sku详情相关
</script>

<style scoped lang="scss">
.search {
    display: flex;
    justify-content: space-between;
}


.text-overflow {
    text-overflow: ellipsis;
    width: 400px;
    overflow: hidden;
    white-space: nowrap;
    color: #409EFF;

}

.text-overflow:hover {
    cursor: pointer;
    text-decoration: underline;
}

.dt {
    div {
        margin-bottom: 10px;
    }
}
</style>
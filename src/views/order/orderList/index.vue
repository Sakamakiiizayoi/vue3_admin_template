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
                <!-- <ElTableColumn label="操作时间" prop="operateTime" width="170px"></ElTableColumn> -->
                <ElTableColumn label="过期时间" prop="expireTime" width="170px"></ElTableColumn>
                <ElTableColumn label="状态" prop="orderStatusName"></ElTableColumn>
                <ElTableColumn label="操作" fixed="right" width="320px">
                    <template #="{ row }">
                        <ElButton type="success" size="small" icon="DocumentChecked" @click="recieveOrder(row)">签收
                        </ElButton>
                        <ElButton type="info" size="small" icon="InfoFilled" @click="showSkuList(row)">查看商品列表</ElButton>
                        <ElButton type="info" size="small" icon="InfoFilled" @click="showOrder(row)">订单详情</ElButton>
                    </template>
                </ElTableColumn>
            </ElTable>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[5, 7, 9, 11]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                @current-change="getHasOrder" @size-change="sizeChange" />
        </ElCard>
        <!-- 显示订单详情Dialog组件 -->
        <ElDialog v-model="orderDetailDialog" title="订单详情">
            <div v-loading="orderDetailLoading" class="dt">
                <ElRow>
                    <ElCol :span="5">收货人</ElCol>
                    <ElCol :span="19">{{ orderDetail.consignee }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">商品</ElCol>
                    <ElCol :span="19">{{ orderDetail.tradeBody }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">收货人手机号</ElCol>
                    <ElCol :span="19">{{ orderDetail.consigneeTel }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">收货地址</ElCol>
                    <ElCol :span="19">{{ orderDetail.deliveryAddress }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">订单号</ElCol>
                    <ElCol :span="19">{{ orderDetail.outTradeNo }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">订单注释</ElCol>
                    <ElCol :span="19">{{ orderDetail.orderComment }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">订单状态</ElCol>
                    <ElCol :span="19">{{ orderDetail.orderStatusName }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">总金额</ElCol>
                    <ElCol :span="19">{{ orderDetail.originalTotalAmount }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">优惠券减免</ElCol>
                    <ElCol :span="19">{{ orderDetail.couponAmount }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">活动减免</ElCol>
                    <ElCol :span="19">{{ orderDetail.activityReduceAmount }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">付款金额</ElCol>
                    <ElCol :span="19">{{ orderDetail.totalAmount }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">支付方式</ElCol>
                    <ElCol :span="19">{{ orderDetail.paymentWay }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">创建时间</ElCol>
                    <ElCol :span="19">{{ orderDetail.createTime }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">过期时间</ElCol>
                    <ElCol :span="19">{{ orderDetail.expireTime }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">操作时间</ElCol>
                    <ElCol :span="19">{{ orderDetail.operateTime }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">更新时间</ElCol>
                    <ElCol :span="19">{{ orderDetail.updateTime }}</ElCol>
                </ElRow>
                <ElRow>
                    <ElCol :span="5">可退款时间</ElCol>
                    <ElCol :span="19">{{ orderDetail.refundableTime }}</ElCol>
                </ElRow>
            </div>
        </ElDialog>
        <!-- 显示sku列表Dialog组件 -->
        <ElDialog v-model="skuListDialog" title="商品列表">
            <ElTable border :data="skuArr" v-loading="skuLoading">
                <ElTableColumn label="商品名字" prop="skuName" show-overflow-tooltip></ElTableColumn>
                <ElTableColumn label="单价" prop="orderPrice"></ElTableColumn>
                <ElTableColumn label="数量" prop="skuNum"></ElTableColumn>
                <ElTableColumn label="活动优惠" prop="splitActivityAmount"></ElTableColumn>
                <ElTableColumn label="优惠券优惠" prop="splitCouponAmount"></ElTableColumn>
                <ElTableColumn label="总计" prop="splitTotalAmount"></ElTableColumn>
                <ElTableColumn label="退款状态" prop="refundStatusString"></ElTableColumn>
                <ElTableColumn label="图片">
                    <template #="{ row }">
                        <ElImage style="width: 100%;" :src="row.imgUrl" fit="contain"></ElImage>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="商品详情" align="center">
                    <template #="{ row }">
                        <ElButton size="small" type="info" icon="InfoFilled" @click="findSku(row)"></ElButton>
                    </template>
                </ElTableColumn>
            </ElTable>
        </ElDialog>
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
import { ref, onMounted, reactive } from 'vue';
import { reqOrderPage, reqOrderRecieve, reqOrderShow } from '@/api/order/orderList/index';
import type { Order, OrderDetailList } from '@/api/order/orderList/type';
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
 * 获取订单分页列表
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
const skuDetailData = ref<SkuData>()
const skuArr = ref<OrderDetailList[]>([])
const skuListDialog = ref(false)
const skuLoading = ref(false)

const showSkuList = (row: Order) => {
    skuListDialog.value = true
    skuArr.value = row.orderDetailList!
}

/**
 * 查看sku详情
 * @param row 
 */
const findSku = async (row: OrderDetailList) => {
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

//#region 签收相关
/**
 * 签收订单按钮回调
 * @param row 
 */
const recieveOrder = async (row: Order) => {
    let result = await reqOrderRecieve(row.id!)
    if (result.code === 200) {
        ElMessage.success('签收成功')
        getHasOrder(pageNo.value)
    } else {
        ElMessage.error(`签收失败：${result.message}|${result.data}`)
    }
}
//#endregion

//#region 订单详情相关
const orderDetail = reactive<Order>({})
const orderDetailDialog = ref(false)
const orderDetailLoading = ref(false)


const showOrder = async (row: Order) => {
    orderDetailDialog.value = true
    orderDetailLoading.value = true
    let result = await reqOrderShow(row.id!)
    orderDetailLoading.value = false
    if (result.code === 200) {
        Object.assign(orderDetail, result.data.orderInfo)
    } else {
        ElMessage.error(`获取订单详情出错：${result.message}|${result.data}`)
    }
}
//#endregion

</script>

<style scoped lang="scss">
.search {
    display: flex;
    justify-content: space-between;
}


.dt {
    div {
        margin-bottom: 10px;
        div:first-child{
            text-align: right;
            padding-right: 20px;
            font-weight: 600;
        }
    }
}
</style>
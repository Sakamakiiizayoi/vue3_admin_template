<template>
    <div>
        <ElCard style="margin-top: 10px;">
            <ElTable v-loading="tableLoading" border style="margin: 10px 0;" :data="orderArr">
                <ElTableColumn label="ID" prop="id"></ElTableColumn>
                <ElTableColumn label="商品名称" prop="skuName" show-overflow-tooltip></ElTableColumn>
                <ElTableColumn label="订单金额" prop="orderPrice"></ElTableColumn>
                <ElTableColumn label="退款类型" prop="refundTypeString"></ElTableColumn>
                <ElTableColumn label="退款数量" prop="refundNum"></ElTableColumn>
                <ElTableColumn label="退款金额" prop="refundAmount"></ElTableColumn>
                <ElTableColumn label="退款原因类型" prop="refundReasonTypeString"></ElTableColumn>
                <ElTableColumn label="退款原因" prop="refundReasonTxt"></ElTableColumn>
                <ElTableColumn label="退款订单编号" prop="outTradeNo" width="170px"></ElTableColumn>
                <ElTableColumn label="状态" prop="refundStatusString"></ElTableColumn>
                <ElTableColumn label="创建时间" prop="createTime" width="170px"></ElTableColumn>
                <ElTableColumn label="审批时间" prop="approveTime" width="170px"></ElTableColumn>
                <ElTableColumn label="审批备注" prop="approveRemark"></ElTableColumn>
                <ElTableColumn label="操作" fixed="right" width="300px">
                    <template #="{ row }">
                        <ElButton type="primary" size="small" icon="DocumentChecked" @click="approve(row)">审批</ElButton>
                        <ElButton type="info" size="small" icon="InfoFilled" @click="findSku(row)">查看商品详情</ElButton>
                    </template>
                </ElTableColumn>
            </ElTable>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[5, 7, 9, 11]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                @current-change="getHasRefund" @size-change="sizeChange" />
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
        <!-- 审批对话框 -->
        <ElDialog v-model="approveDialogVisible" title="审批" style="max-width: 600px;">
            <ElForm label-width="100px">
                <ElFormItem label="审核">
                    <ElSelect v-model="approveParams.status">
                        <ElOption :value="1" label="审核通过"></ElOption>
                        <ElOption :value="0" label="审核不通过"></ElOption>
                    </ElSelect>
                </ElFormItem>
                <ElFormItem label="审批备注">
                    <ElInput type="textarea" placeholder="请输入备注" v-model="approveParams.remark"></ElInput>
                </ElFormItem>

            </ElForm>
            <template #footer>
                <ElButton @click="cancel">取消</ElButton>
                <ElButton type="primary" @click="confirm">确定</ElButton>
            </template>
        </ElDialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { reqRefundPage, reqRefundApproval } from '@/api/order/refund/index';
import type { Refund, RefundApprovalVo } from '@/api/order/refund/type';
import { reqGetSkuById } from '@/api/product/sku';
import { SkuData } from '@/api/product/sku/type';


//#region 分页列表展示相关
let tableLoading = ref(false)
let pageNo = ref(1)
let limit = ref(5)
let total = ref(0)
let orderArr = ref<Refund[]>([])

onMounted(() => {
    getHasRefund()
})

/**
 * 获取用户分页列表
 * @param page 
 */
const getHasRefund = async (page = 1) => {
    pageNo.value = page
    tableLoading.value = true
    let result = await reqRefundPage(pageNo.value, limit.value)
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
    getHasRefund()
}
//#endregion 分页列表展示相关

//#region 显示sku详情相关
const drawer = ref(false)
const drawerLoading = ref(false)
let skuDetailData = ref<SkuData>()
/**
 * 查看sku详情
 * @param row 
 */
const findSku = async (row: Refund) => {
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

//#region 审批相关
const approveParams = ref<RefundApprovalVo>({
    id: undefined,
    remark: '',
    status: 0,
})
const approveDialogVisible = ref(false)

/**
 * 审批按钮回调事件
 * @param row 
 */
const approve = (row: Refund) => {
    approveDialogVisible.value = true
    approveParams.value.id = row.id
}

/**
 * 对话框取消
 */
const cancel = () => {
    approveDialogVisible.value = false
}
/**
 * 审批确定提交
 */
const confirm = async () => {
    let result = await reqRefundApproval(approveParams.value)
    if(result.code === 200){
        ElMessage.success('审批成功')
        getHasRefund(pageNo.value)
    }else{
        ElMessage.error(`审批失败：${result.message}|${result.data}`)
    }
    approveDialogVisible.value = false
}
//#endregion

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
<template>
    <div>
        <ElCard style="margin-top: 10px;">
            <ElButton type="primary" icon="Plus" @click="addCoupon">添加优惠</ElButton>
            <ElPopconfirm :title="`确认删除选中活动？`" width="250px" icon="Delete" @confirm="batchDeleteCoupon">
                <template #reference>
                    <ElButton type="danger" icon="Delete">批量删除</ElButton>
                </template>
            </ElPopconfirm>
            <ElTable ref="tableRef" v-loading="tableLoading" border style="margin: 10px 0;" :data="couponArr">
                <ElTableColumn type="selection"></ElTableColumn>
                <ElTableColumn label="ID" prop="id" width="50px" show-overflow-tooltip></ElTableColumn>
                <ElTableColumn label="优惠券名称" prop="couponName" min-width="95px"></ElTableColumn>
                <ElTableColumn label="优惠券类型" prop="couponTypeString" width="95px" align="center"></ElTableColumn>
                <ElTableColumn label="适用范围" prop="rangeTypeString" min-width="90px" align="center"></ElTableColumn>
                <ElTableColumn label="范围描述" prop="rangeDesc" min-width="90px" align="center"></ElTableColumn>
                <ElTableColumn label="条件金额" prop="conditionAmount" min-width="81px" align="center"></ElTableColumn>
                <ElTableColumn label="条件数量" prop="conditionNum" min-width="81px" align="center"></ElTableColumn>
                <ElTableColumn label="限量" prop="limitNum" min-width="80px" align="center"></ElTableColumn>
                <ElTableColumn label="优惠金额" prop="benefitAmount" min-width="81px" align="center"></ElTableColumn>
                <ElTableColumn label="优惠折扣" prop="benefitDiscount" min-width="81px" align="center"></ElTableColumn>
                <ElTableColumn label="开始时间" prop="startTime" width="170px"></ElTableColumn>
                <ElTableColumn label="结束时间" prop="endTime" width="170px"></ElTableColumn>
                <ElTableColumn label="过期时间" prop="expireTime" width="170px"></ElTableColumn>
                <ElTableColumn label="操作时间" prop="operateTime" width="170px"></ElTableColumn>
                <ElTableColumn label="操作" fixed="right" width="270px">
                    <template #="{ row }">
                        <ElButton type="primary" size="small" icon="Edit" @click="editCoupon(row)">编辑</ElButton>
                        <ElButton type="success" size="small" icon="Edit" @click="editCouponRule(row)">编辑适用范围</ElButton>
                        <ElPopconfirm :title="`确认删除${row.couponName}优惠券？`" width="250px" icon="Delete"
                            @confirm="deleteCoupon(row.id)">
                            <template #reference>
                                <ElButton type="danger" size="small" icon="Delete" v-has="'btn.Activity.remove'"></ElButton>
                            </template>
                        </ElPopconfirm>
                    </template>
                </ElTableColumn>
            </ElTable>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[5, 7, 9, 11]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                @current-change="getHasCoupon" @size-change="sizeChange" />
        </ElCard>
        <!-- dialog组件 -->
        <ElDialog v-model="addCouponDialogVisible" :title="couponParams.id ? '修改活动' : '添加活动'" style="max-width: 600px;">
            <ElForm style="width: 80%;">
                <ElFormItem label="优惠券名称" label-width="100px">
                    <ElInput placeholder="请输入优惠券名称" v-model="couponParams.couponName"></ElInput>
                </ElFormItem>
                <ElFormItem label="优惠券类型" label-width="100px">
                    <ElSelect v-model="couponParams.couponType">
                        <ElOption label="满量打折" value="FULL_DISCOUNT"></ElOption>
                        <ElOption label="现金券" value="CASH"></ElOption>
                    </ElSelect>
                </ElFormItem>
                <ElFormItem label="适用范围" label-width="100px">
                    <ElSelect v-model="couponParams.rangeType">
                        <ElOption label="品牌券" value="TRADEMARK"></ElOption>
                        <ElOption label="单品(spu)" value="SPU"></ElOption>
                    </ElSelect>
                </ElFormItem>
                <ElFormItem label="范围描述" label-width="100px">
                    <ElInput type="textarea" placeholder="请输入简介名称" v-model="couponParams.rangeDesc"></ElInput>
                </ElFormItem>
                <ElFormItem label="条件金额" label-width="100px">
                    <ElInput type="number" placeholder="请输入条件金额" v-model.number="couponParams.conditionAmount"></ElInput>
                </ElFormItem>
                <ElFormItem label="条件数量" label-width="100px">
                    <ElInput type="number" placeholder="请输入条件数量" v-model.number="couponParams.conditionNum"></ElInput>
                </ElFormItem>
                <ElFormItem label="限量" label-width="100px">
                    <ElInput type="number" placeholder="请输入限量数量" v-model.number="couponParams.limitNum"></ElInput>
                </ElFormItem>
                <ElFormItem label="优惠金额" label-width="100px">
                    <ElInput type="number" placeholder="请输入优惠金额" v-model.number="couponParams.benefitAmount"></ElInput>
                </ElFormItem>
                <ElFormItem label="优惠折扣" label-width="100px">
                    <ElInput type="number" placeholder="请输入优惠折扣" v-model.number="couponParams.benefitDiscount"></ElInput>
                </ElFormItem>

                <ElFormItem label="开始结束时间" label-width="100px">
                    <el-date-picker v-model="datetimeRange" type="datetimerange" range-separator="到"
                        start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts" />
                </ElFormItem>
                <ElFormItem label="过期时间" label-width="100px">
                    <el-date-picker placeholder="过期时间" v-model="expireTime" type="datetime" />
                </ElFormItem>
            </ElForm>
            <template #footer>
                <ElButton @click="saveCouponCancel">取消</ElButton>
                <ElButton type="primary" @click="saveCouponConfirm">确定</ElButton>
            </template>
        </ElDialog>
        <!-- 抽屉组件 -->
        <el-drawer v-model="setCouponRuleDrawer" direction="rtl">
            <template #header>
                <h4>优惠范围</h4>
            </template>
            <template #default>
                <ElScrollbar v-loading="ruleListLoading">
                    <div v-if="couponRuleParams.rangeType === 'TRADEMARK'">
                        <div class="title">优惠券适用品牌：</div>
                        <div class="trademarkSelectList">
                            <div v-if="selectTrademark.length === 0" class="tip">待添加品牌</div>
                            <ElSpace wrap :size="5">
                                <TrademarkInfoBox delete="true" @delete="deleteTrademarkInSeleteList(index)"
                                    v-for="(item, index) in selectTrademark" :key="item.id" :trademark="item" />
                            </ElSpace>
                        </div>
                        <div class="trademarkSearchList">
                            <ElInput v-model="trademarkKeyword" placeholder="请输入商品名查询" @keydown.enter="searchTrademark">
                                <template #append>
                                    <el-button icon="Search" @click="searchTrademark" />
                                </template>
                            </ElInput>
                            <div class="result" v-loading="trademarkResultLoading">
                                <ElSpace wrap :size="5">
                                    <TrademarkInfoBox add="true" @add="addTrademarkToSelectList(index)"
                                        v-for="(item, index) in trademarkResult" :key="item.id" :trademark="item" />
                                </ElSpace>
                            </div>
                        </div>
                    </div>
                    <div v-if="couponRuleParams.rangeType === 'SPU'">
                        <div class="title">优惠券适用SPU：</div>
                        <div class="spuSelectList">
                            <div v-if="selectSpu.length === 0" class="tip">待添加SPU</div>
                            <ElSpace wrap :size="5">
                                <SpuInfoBox delete="true" @delete="deleteSpuInSeleteList(index)"
                                    v-for="(item, index) in selectSpu" :key="item.id" :spu="item" />
                            </ElSpace>
                        </div>
                        <div class="spuSearchList">
                            <ElInput v-model="spuKeyword" placeholder="请输入SPU名查询" @keydown.enter="searchSpu">
                                <template #append>
                                    <el-button icon="Search" @click="searchSpu" />
                                </template>
                            </ElInput>
                            <div class="result" v-loading="spuResultLoading">
                                <ElSpace wrap :size="5">
                                    <SpuInfoBox add="true" @add="addSpuToSelectList(index)"
                                        v-for="(item, index) in spuResult" :key="item.id" :spu="item" />
                                </ElSpace>
                            </div>
                        </div>
                    </div>
                    <div class="title">范围描述：</div>
                    <ElInput type="textarea" placeholder="请输入范围描述" v-model="couponRuleParams.rangeDesc"></ElInput>
                </ElScrollbar>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="setCouponRuleCancel">取消</el-button>
                    <el-button type="primary" @click="setCouponRuleSave">确认</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import TrademarkInfoBox from './trademarkInfoBox.vue';
import SpuInfoBox from './spuInfoBox.vue';
import { reqGetCouponPage, reqSaveOrUpdateCoupon, reqRemoveCoupon, reqBatchRemoveCoupon, reqSaveCouponRule, reqGetCouponRule } from '@/api/discount/coupon/index';
import type { Coupon, CouponRule, TrademarkInfo, SpuInfo } from '@/api/discount/coupon/type';
import type { TableInstance } from 'element-plus';
import { reqFindTrademarkByKeyword } from '@/api/product/trademark';
import { reqFindSpuByKeyword } from '@/api/product/spu';

//#region 分页列表展示相关
let tableLoading = ref(false)
let pageNo = ref(1)
let limit = ref(5)
let total = ref(0)
let couponArr = ref<Coupon[]>([])

onMounted(() => {
    getHasCoupon()
})

/**
 * 获取优惠券分页列表
 * @param page 
 */
const getHasCoupon = async (page = 1) => {
    pageNo.value = page
    tableLoading.value = true
    let result = await reqGetCouponPage(pageNo.value, limit.value)
    tableLoading.value = false
    if (result.code === 200) {
        couponArr.value = result.data.records
        total.value = result.data.total
    }
}

/**
 * 分页数量改变回调
 * @param pageSize 
 */
const sizeChange = (pageSize: number) => {
    limit.value = pageSize
    getHasCoupon()
}
//#endregion

//#region 添加修改优惠券相关
const addCouponDialogVisible = ref(false)
const datetimeRange = ref<[Date, Date]>()
const expireTime = ref<Date>()
const defaultCouponValue: Coupon = {
    id: undefined,
    couponName: '',
    couponType: 'FULL_DISCOUNT',
    startTime: '',
    endTime: '',
    expireTime: '',
    rangeType: 'TRADEMARK',
    rangeDesc: '',
    conditionAmount: undefined,
    conditionNum: undefined,
    benefitAmount: undefined,
    benefitDiscount: undefined,
    limitNum: undefined,
    activityId: undefined,
    takenCount: undefined,
    createTime: undefined,
    operateTime: undefined,
    isGet: undefined,
    rangeId: undefined,
    couponTypeString: undefined,
    rangeTypeString: undefined,
    skuIdList: undefined,
    couponStatus: undefined,
    reduceAmount: undefined,
    isChecked: undefined,
    isSelect: undefined,
    updateTime: undefined,
}
const couponParams = reactive<Coupon>(JSON.parse(JSON.stringify(defaultCouponValue)))

//当选择日期对象改变时 同步数据到字符串类型时间
watch(datetimeRange, () => {
    couponParams.startTime = datetimeRange.value ? datetimeRange.value[0].toLocaleString().replace(/\//g, '-') : ''
    couponParams.endTime = datetimeRange.value ? datetimeRange.value[1].toLocaleString().replace(/\//g, '-') : ''
})
watch(expireTime, () => {
    couponParams.expireTime = expireTime.value ? expireTime.value.toLocaleString().replace(/\//g, '-') : ''
})

/**
 * 添加优惠券按钮回调
 */
const addCoupon = () => {
    addCouponDialogVisible.value = true
    Object.assign(couponParams, defaultCouponValue)
    //同步时间字符串
    datetimeRange.value = [
        new Date(),
        new Date(),
    ]
    expireTime.value = new Date()
}

/**
 * 编辑优惠券按钮回调
 */
const editCoupon = (row: Coupon) => {
    addCouponDialogVisible.value = true
    Object.assign(couponParams, row)
    //同步时间字符串
    datetimeRange.value = [
        new Date(Date.parse(row.startTime)),
        new Date(Date.parse(row.endTime)),
    ]
    expireTime.value = new Date(Date.parse(row.expireTime))
}

/**
 * 保存优惠券对话框取消
 */
const saveCouponCancel = () => {
    addCouponDialogVisible.value = false
}

/**
 * 保存优惠券对话框确认
 */
const saveCouponConfirm = async () => {
    addCouponDialogVisible.value = false
    let result = await reqSaveOrUpdateCoupon(couponParams)
    if (result.code === 200) {
        ElMessage.success('保存成功')
        getHasCoupon()
    } else {
        ElMessage.error(`保存出错：${result.message}|${result.data}`)
    }
}


//时间选择快捷方式
const shortcuts = [
    {
        text: '一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '一个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    }
]
//#endregion

//#region 删除优惠券相关
let tableRef = ref<TableInstance>()

/**
 * 删除优惠券按钮回调
 * @param couponId 
 */
const deleteCoupon = async (couponId: number) => {
    let result = await reqRemoveCoupon(couponId)
    if (result.code === 200) {
        ElMessage.success('删除成功')
        getHasCoupon(pageNo.value)
    } else {
        ElMessage.error(`删除失败：${result.message}|${result.data}`)
    }
}

/**
 * 批量删除优惠券
 */
const batchDeleteCoupon = async () => {
    let selectRows: Coupon[] = tableRef.value!.getSelectionRows()
    let idList = selectRows.map((item) => {
        return item.id!.toString()
    })
    let result = await reqBatchRemoveCoupon(idList)
    if (result.code === 200) {
        ElMessage.success('批量删除成功')
        getHasCoupon(pageNo.value)
    } else {
        ElMessage.error(`删除失败：${result.message}|${result.data}`)
    }
}
//#endregion

//#region 添加优惠券适用范围相关
const ruleListLoading = ref(false)
const setCouponRuleDrawer = ref(false)

const selectTrademark = ref<TrademarkInfo[]>([])
const selectSpu = ref<SpuInfo[]>([])
const trademarkKeyword = ref('')
const spuKeyword = ref('')
const trademarkResult = ref<TrademarkInfo[]>([])
const spuResult = ref<SpuInfo[]>([])
const trademarkResultLoading = ref(false)
const spuResultLoading = ref(false)
const couponRuleParams = ref<CouponRule>({
    couponId: undefined,
    rangeType: 'SPU',
    couponRangeList: [],
    rangeDesc: ''
})

/**
 * 编辑优惠券范围规则按钮回调
 * @param row 
 */
const editCouponRule = async (row: Coupon) => {
    setCouponRuleDrawer.value = true
    //重置数据为空
    selectTrademark.value = []
    trademarkResult.value = []
    trademarkKeyword.value = ''
    selectSpu.value = []
    spuResult.value = []
    spuKeyword.value = ''

    couponRuleParams.value.rangeType = row.rangeType
    couponRuleParams.value.couponId = row.id
    couponRuleParams.value.rangeDesc = row.rangeDesc

    ruleListLoading.value = true
    let result = await reqGetCouponRule(row.id!)
    ruleListLoading.value = false

    if (result.code === 200) {
        if (couponRuleParams.value.rangeType === 'TRADEMARK') {
            selectTrademark.value = result.data.trademarkList ? result.data.trademarkList : []
        } else {
            selectSpu.value = result.data.spuInfoList ? result.data.spuInfoList : []
        }

    }
}

/**
 * 通过关键字搜索品牌
 */
const searchTrademark = async () => {
    trademarkResultLoading.value = true
    let result = await reqFindTrademarkByKeyword(trademarkKeyword.value)
    trademarkResultLoading.value = false
    if (result.code === 200) {
        trademarkResult.value = result.data
    } else {
        ElMessage.error(`查询错误：${result.message}|${result.data}`)
    }
}

/**
 * 从选列表中移除品牌
 * @param index 
 */
const deleteTrademarkInSeleteList = (index: number) => {
    trademarkResult.value.push(selectTrademark.value.splice(index, 1)[0])
}

/**
 * 添加品牌至选中区
 * @param index 
 */
const addTrademarkToSelectList = (index: number) => {
    selectTrademark.value.push(trademarkResult.value.splice(index, 1)[0])
}

/**
 * 通过关键字搜索spu
 */
const searchSpu = async () => {
    spuResultLoading.value = true
    let result = await reqFindSpuByKeyword(spuKeyword.value)
    spuResultLoading.value = false
    if (result.code === 200) {
        spuResult.value = result.data
    } else {
        ElMessage.error(`查询错误：${result.message}|${result.data}`)
    }
}

/**
 * 从选列表中移除spu
 * @param index 
 */
const deleteSpuInSeleteList = (index: number) => {
    spuResult.value.push(selectSpu.value.splice(index, 1)[0])
}

/**
 * 添加spu至选中区
 * @param index 
 */
const addSpuToSelectList = (index: number) => {
    selectSpu.value.push(spuResult.value.splice(index, 1)[0])
}

/**
 * 取消保存优惠规则
 */
const setCouponRuleCancel = () => {
    setCouponRuleDrawer.value = false
}

/**
 * 保存优惠规则
 */
const setCouponRuleSave = async () => {
    if (couponRuleParams.value.rangeType === 'TRADEMARK') {
        couponRuleParams.value.couponRangeList = selectTrademark.value.map((item) => {
            return {
                couponId: couponRuleParams.value.couponId!,
                rangeType: couponRuleParams.value.rangeType!,
                rangeId: item.id!
                // id: item.id!
            }
        })
    } else if (couponRuleParams.value.rangeType === 'SPU') {
        couponRuleParams.value.couponRangeList = selectSpu.value.map((item) => {
            return {
                couponId: couponRuleParams.value.couponId!,
                rangeType: couponRuleParams.value.rangeType!,
                rangeId: item.id!
                // id: item.id!
            }
        })
    } else {
        return
    }

    let result = await reqSaveCouponRule(couponRuleParams.value)
    if (result.code === 200) {
        ElMessage.success('保存成功')
        getHasCoupon(pageNo.value)
    } else {
        ElMessage.error(`保存失败：${result.message}|${result.data}`)
    }
    setCouponRuleDrawer.value = false
}
//#endregion

</script>

<style scoped lang="scss">
.trademarkSelectList,
.spuSelectList,
.trademarkSearchList,
.spuSearchList {
    border: 1px solid #CDD0D6;
    padding: 10px;
    margin-bottom: 10px;
}

.tip {
    color: #909399;
    font-size: small;
}

.result {
    min-height: 100px;
}

.title {
    font-size: large;
    font-weight: 600;
    margin-bottom: 10px;
}
</style>
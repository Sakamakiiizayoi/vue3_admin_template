<template>
    <div>
        <ElCard style="margin-top: 10px;">
            <ElButton type="primary" icon="Plus" @click="addActivity">添加活动</ElButton>
            <ElPopconfirm :title="`确认删除选中活动？`" width="250px" icon="Delete" @confirm="batchDeleteActivity">
                <template #reference>
                    <ElButton type="danger" icon="Delete">批量删除</ElButton>
                </template>
            </ElPopconfirm>
            <ElTable ref="tableRef" v-loading="tableLoading" border style="margin: 10px 0;" :data="activityArr">
                <ElTableColumn type="selection"></ElTableColumn>
                <ElTableColumn label="ID" prop="id" width="50px" show-overflow-tooltip></ElTableColumn>
                <ElTableColumn label="活动名称" prop="activityName" min-width="81px"></ElTableColumn>
                <ElTableColumn label="活动类型" prop="activityTypeString" width="81px" align="center"></ElTableColumn>
                <ElTableColumn label="活动简介" prop="activityDesc" min-width="81px" show-overflow-tooltip></ElTableColumn>
                <ElTableColumn label="开始时间" prop="startTime" width="170px"></ElTableColumn>
                <ElTableColumn label="结束时间" prop="endTime" width="170px"></ElTableColumn>
                <ElTableColumn label="创建时间" prop="createTime" width="170px"></ElTableColumn>
                <ElTableColumn label="更新时间" prop="updateTime" width="170px"></ElTableColumn>
                <ElTableColumn label="操作" fixed="right" width="270px">
                    <template #="{ row }">
                        <ElButton type="success" size="small" icon="Plus" @click="addActivityRule(row)">编辑活动规则</ElButton>
                        <ElButton type="primary" size="small" icon="Edit" @click="editActivity(row)">编辑</ElButton>
                        <ElPopconfirm :title="`确认删除${row.activityName}活动？`" width="250px" icon="Delete"
                            @confirm="deleteActivity(row.id)">
                            <template #reference>
                                <ElButton type="danger" size="small" icon="Delete" v-has="'btn.Activity.remove'"></ElButton>
                            </template>
                        </ElPopconfirm>
                    </template>
                </ElTableColumn>
            </ElTable>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[5, 7, 9, 11]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                @current-change="getHasActivity" @size-change="sizeChange" />
        </ElCard>
        <!-- dialog组件 -->
        <ElDialog v-model="dialogVisible" :title="activityParams.id ? '修改活动' : '添加活动'" style="max-width: 600px;">
            <ElForm style="width: 80%;">
                <ElFormItem label="活动名称" label-width="100px">
                    <ElInput placeholder="请输入活动名称" v-model="activityParams.activityName"></ElInput>
                </ElFormItem>
                <ElFormItem label="活动类型" label-width="100px">
                    <ElSelect v-model="activityParams.activityType">
                        <ElOption label="满减" value="FULL_REDUCTION"></ElOption>
                    </ElSelect>
                </ElFormItem>
                <ElFormItem label="活动简介" label-width="100px">
                    <ElInput type="textarea" placeholder="请输入简介名称" v-model="activityParams.activityDesc"></ElInput>
                </ElFormItem>
                <ElFormItem label="开始结束时间" label-width="100px">
                    <el-date-picker v-model="datetimeRange" type="datetimerange" range-separator="到"
                        start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts" />
                </ElFormItem>
            </ElForm>
            <template #footer>
                <ElButton @click="cancel">取消</ElButton>
                <ElButton type="primary" @click="confirm">确定</ElButton>
            </template>
        </ElDialog>
        <!-- 抽屉组件 -->
        <el-drawer v-model="setActivityRuleDrawer" direction="rtl">
            <template #header>
                <h4>活动规则</h4>
            </template>
            <template #default>
                <ElScrollbar v-loading="ruleListLoading">
                    <div class="title">活动的优惠规则：</div>
                    <div class="ruleList">
                        <div v-if="activityRuleParams.activityRuleList.length === 0" class="tip">待添加条件</div>
                        <RuleBox @delete-rule="deleteRule(index)"
                            v-for="(activityRule, index) in activityRuleParams.activityRuleList" :key="index"
                            :activity-rule="activityRule" >
                            <template #title>
                                优惠规则{{ index + 1 }}
                            </template>
                        </RuleBox>
                    </div>
                    <ElButton type="primary" icon="Plus" @click="addRule">添加优惠条件</ElButton>
                    <el-divider border-style="dashed" />
                    <div class="title">参与活动的商品：</div>
                    <div class="skuSelectList">
                        <div v-if="selectSku.length === 0" class="tip">待添加商品</div>
                        <ElSpace wrap :size="5">
                            <SkuBox delete="true" @delete="deleteSkuInSeleteList(index)" v-for="(item, index) in selectSku"
                                :key="item.id" :sku-info="item" />
                        </ElSpace>
                    </div>
                    <div class="skuList">
                        <ElInput v-model="skuKeyword" placeholder="请输入商品名查询" @keydown.enter="searchSku">
                            <template #append>
                                <el-button icon="Search" @click="searchSku" />
                            </template>
                        </ElInput>
                        <div class="result" v-loading="skuResultLoading">
                            <ElSpace wrap>
                                <SkuBox add="true" @add="addSkuToSelectList(index)" v-for="(item, index) in skuResult"
                                    :key="item.id" :sku-info="item" />
                            </ElSpace>
                        </div>
                    </div>
                </ElScrollbar>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="setActivityRuleCancel">取消</el-button>
                    <el-button type="primary" @click="setActivityRuleSave">确认</el-button>
                </div>
            </template>
        </el-drawer>
        <!-- dialog组件 -->
        <ElDialog v-model="ruleDialogVisible" title="优惠条件" style="max-width: 600px;">
            <ElForm style="width: 80%;">
                <ElFormItem label="条件金额" label-width="100px">
                    <ElInput placeholder="请输入条件金额" v-model.number="ruleParams.conditionAmount"></ElInput>
                </ElFormItem>
                <ElFormItem label="条件数量" label-width="100px">
                    <ElInput placeholder="请输入条件数量" v-model.number="ruleParams.conditionNum"></ElInput>
                </ElFormItem>
                <ElFormItem label="优惠金额" label-width="100px">
                    <ElInput placeholder="请输入优惠金额" v-model.number="ruleParams.benefitAmount"></ElInput>
                </ElFormItem>
                <ElFormItem label="优惠折扣" label-width="100px">
                    <ElInput placeholder="请输入优惠折扣" v-model.number="ruleParams.benefitDiscount"></ElInput>
                </ElFormItem>
                <ElFormItem label="优惠等级" label-width="100px">
                    <ElInput placeholder="请输入优惠等级" v-model.number="ruleParams.benefitLevel"></ElInput>
                </ElFormItem>
            </ElForm>
            <template #footer>
                <ElButton @click="ruleDialogVisible = false">取消</ElButton>
                <ElButton type="primary" @click="ruleConfirm">确定</ElButton>
            </template>
        </ElDialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import RuleBox from './ruleBox.vue';
import SkuBox from './skuBox.vue';
import { reqActivityPage, reqSaveOrUpdateActivity, reqRemoveActivity, reqBatchRemoveActivity, reqFindSku, reqSaveActivityRule, reqFindActivityRule } from '@/api/discount/activity/index';
import type { Activity, ActivityRuleParams, ActivityRule, SkuInfo } from '@/api/discount/activity/type';
import type { TableInstance } from 'element-plus';

const tableRef = ref<TableInstance>()

//#region 分页列表展示相关
let tableLoading = ref(false)
let pageNo = ref(1)
let limit = ref(5)
let total = ref(0)
let activityArr = ref<Activity[]>([])

onMounted(() => {
    getHasActivity()
})

/**
 * 获取订单分页列表
 * @param page 
 */
const getHasActivity = async (page = 1) => {
    pageNo.value = page
    tableLoading.value = true
    let result = await reqActivityPage(pageNo.value, limit.value)
    tableLoading.value = false
    if (result.code === 200) {
        activityArr.value = result.data.records
        total.value = result.data.total
    }
}

/**
 * 分页数量改变回调
 * @param pageSize 
 */
const sizeChange = (pageSize: number) => {
    limit.value = pageSize
    getHasActivity()
}
//#endregion

//#region 添加更新活动相关
let dateNow = new Date()
let dateNowString = dateNow.toLocaleString().replace(/\//g, '-')
const dialogVisible = ref(false)
const activityParams = reactive<Activity>({
    id: undefined,
    activityName: '',
    activityType: 'FULL_REDUCTION',
    activityDesc: '',
    startTime: dateNowString,
    endTime: dateNowString,
})
const datetimeRange = ref<[Date, Date]>([
    dateNow,
    dateNow,
])
watch(datetimeRange, () => {
    if (datetimeRange.value) {
        activityParams.startTime = datetimeRange.value[0].toLocaleString().replace(/\//g, '-')
        activityParams.endTime = datetimeRange.value[1].toLocaleString().replace(/\//g, '-')
    }
})

/**
 * 添加活动按钮回调
 */
const addActivity = () => {
    dialogVisible.value = true
    Object.assign(activityParams, {
        id: undefined,
        activityName: '',
        activityType: 'FULL_REDUCTION',
        activityDesc: '',
        startTime: dateNowString,
        endTime: dateNowString,
    })
    datetimeRange.value = [
        dateNow,
        dateNow,
    ]
}

/**
 * 编辑活动按钮回调
 * @param row 
 */
const editActivity = (row: Activity) => {
    Object.assign(activityParams, row)
    datetimeRange.value = [
        new Date(Date.parse(row.startTime)),
        new Date(Date.parse(row.endTime)),
    ]
    dialogVisible.value = true
}

/**
 * 对话框取消
 */
const cancel = () => {
    dialogVisible.value = false
}

/**
 * 对话框确认
 */
const confirm = async () => {
    dialogVisible.value = false
    saveRequest()
}

/**
 * 保存活动请求
 */
const saveRequest = async () => {
    let msg = activityParams.id ? '修改' : '添加'
    let result = await reqSaveOrUpdateActivity(activityParams)
    if (result.code === 200) {
        ElMessage.success(`${msg}成功`)
        getHasActivity(pageNo.value)
    } else {
        ElMessage.error(`${msg}失败：${result.message}|${result.data}`)
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

//#region 删除活动相关

/**
 * 删除活动
 * @param row 
 */
const deleteActivity = async (id: number) => {
    let result = await reqRemoveActivity(id)
    if (result.code === 200) {
        ElMessage.success('删除成功')
        getHasActivity(pageNo.value)
    } else {
        ElMessage.error(`删除失败：${result.message}|${result.data}`)
    }
}

/**
 * 批量删除活动
 */
const batchDeleteActivity = async () => {
    let selectRows: Activity[] = tableRef.value?.getSelectionRows()
    let idList = selectRows.map((item) => {
        return item.id!.toString()
    })
    let result = await reqBatchRemoveActivity(idList)
    if (result.code === 200) {
        ElMessage.success('批量删除成功')
        getHasActivity(pageNo.value)
    } else {
        ElMessage.error(`批量删除失败：${result.message}|${result.data}`)
    }
}
//#endregion

//#region 活动规则相关
const setActivityRuleDrawer = ref(false)
const ruleDialogVisible = ref(false)
const ruleListLoading = ref(false)
const skuResultLoading = ref(false)
const selectSku = ref<SkuInfo[]>([])
const skuResult = ref<SkuInfo[]>([])
const skuKeyword = ref('')
const activityRuleParams = reactive<ActivityRuleParams>({
    activityId: undefined,
    activityRuleList: [],
    activitySkuList: [],
    couponIdList: []
})
const ruleParams = reactive<ActivityRule>({
    benefitAmount: undefined,
    benefitDiscount: undefined,
    benefitLevel: undefined,
    conditionAmount: undefined,
    conditionNum: undefined
})

/**
 * 搜索商品
 */
const searchSku = async () => {
    skuResultLoading.value = true
    let result = await reqFindSku(skuKeyword.value)
    skuResultLoading.value = false
    if (result.code === 200) {
        skuResult.value = result.data
    }
}

/**
 * 添加商品至选中区
 * @param index 
 */
const addSkuToSelectList = (index: number) => {
    selectSku.value.push(skuResult.value.splice(index, 1)[0])
}

/**
 * 移除选中商品
 * @param index 
 */
const deleteSkuInSeleteList = (index: number) => {

    skuResult.value.push(selectSku.value.splice(index, 1)[0])
}

/**
 * 添加活动规则按钮回调，弹出添加活动规则的抽屉
 * @param row 
 */
const addActivityRule = async (row: Activity) => {
    setActivityRuleDrawer.value = true
    skuResult.value = []
    skuKeyword.value = ''
    activityRuleParams.activityId = row.id

    ruleListLoading.value = true
    let result = await reqFindActivityRule(row.id!)
    ruleListLoading.value = false

    if (result.code === 200) {
        activityRuleParams.activityRuleList = result.data.activityRuleList
        selectSku.value = result.data.skuInfoList != null ? result.data.skuInfoList : []
    }
}

/**
 * 添加活动优惠条件弹窗按钮回调
 */
const addRule = () => {
    ruleDialogVisible.value = true
    Object.assign(ruleParams, {
        benefitAmount: undefined,
        benefitDiscount: undefined,
        benefitLevel: undefined,
        conditionAmount: undefined,
        conditionNum: undefined
    })
}

/**
 * 删除活动优惠条件
 * @param index 
 */
const deleteRule = (index: number) => {
    activityRuleParams.activityRuleList.splice(index, 1)
}

/**
 * 确定添加活动优惠条件
 */
const ruleConfirm = () => {
    ruleDialogVisible.value = false
    activityRuleParams.activityRuleList.push(JSON.parse(JSON.stringify(ruleParams)))
}

/**
 * 取消保存活动规则
 */
const setActivityRuleCancel = () => {
    setActivityRuleDrawer.value = false

}

/**
 * 确定保存活动规则按钮回调
 */
const setActivityRuleSave = async () => {
    setActivityRuleDrawer.value = false
    activityRuleParams.activitySkuList = selectSku.value.map((item) => {
        return {
            skuId: item.id
        }
    })
    let result = await reqSaveActivityRule(activityRuleParams)
    if (result.code === 200) {
        ElMessage.success('保存成功')
    } else {
        ElMessage.error(`保存失败：${result.message}|${result.data}`)
    }
}

//#endregion

</script>

<style scoped lang="scss">
.tip {
    color: #909399;
    font-size: small;
}

.ruleList {
    border: 1px solid #CDD0D6;
    padding: 10px;
    margin-bottom: 10px;
}

.skuSelectList {
    border: 1px solid #CDD0D6;
    padding: 10px;
    margin-bottom: 10px;
}

.result {
    min-height: 100px;
}

.title{
    font-size: large;
    font-weight: 600;
    margin-bottom: 10px;
}
</style>
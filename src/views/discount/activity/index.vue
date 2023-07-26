<template>
    <div>
        <ElCard style="margin-top: 10px;">
            <ElButton type="primary" icon="Plus" @click="addActivity">添加活动</ElButton>
            <ElTable v-loading="tableLoading" border style="margin: 10px 0;" :data="activityArr">
                <ElTableColumn label="ID" prop="id" width="100px"></ElTableColumn>
                <ElTableColumn label="活动名称" prop="activityName" min-width="81px"></ElTableColumn>
                <ElTableColumn label="活动类型" prop="activityTypeString" min-width="81px" align="center"></ElTableColumn>
                <ElTableColumn label="活动简介" prop="activityDesc" show-overflow-tooltip></ElTableColumn>
                <ElTableColumn label="开始时间" prop="startTime" width="170px"></ElTableColumn>
                <ElTableColumn label="结束时间" prop="endTime" width="170px"></ElTableColumn>
                <ElTableColumn label="创建时间" prop="createTime" width="170px"></ElTableColumn>
                <ElTableColumn label="更新时间" prop="updateTime" width="170px"></ElTableColumn>
                <ElTableColumn label="操作" fixed="right" width="200px">
                    <template #="{ row }">
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
            <ElForm style="width: 80%;" ref="formElRef">
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
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { reqActivityPage, reqSaveOrUpdateActivity, reqRemoveActivity } from '@/api/discount/activity/index';
import type { Activity } from '@/api/discount/activity/type';

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
 * 删除提交
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
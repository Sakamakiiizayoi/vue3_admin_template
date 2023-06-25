<template>
    <div>
        <ElCard>
            <ElButton type="primary" icon="Plus" @click="addTrademark">添加品牌</ElButton>
            <!-- 表格 -->
            <ElTable v-loading=loading :border="true" :data="trademarkArr" class="table">
                <ElTableColumn label="序号" width="80px" align="center" type="index"></ElTableColumn>
                <ElTableColumn label="品牌名称">
                    <template #="{ row }">
                        <pre>{{ row.tmName }}</pre>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="品牌LOGO">
                    <template #="{ row }">
                        <ElImage :src="row.logoUrl" style="width: 100px;height: auto;" fit="cover"></ElImage>
                        <!-- <img :src="row.logoUrl" alt="" style="width: 100px;height: 100px;"> -->
                    </template>
                </ElTableColumn>
                <ElTableColumn label="品牌操作">
                    <template #="{ row }">
                        <ElButton type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></ElButton>
                        <ElButton type="primary" size="small" icon="Delete"></ElButton>
                    </template>
                </ElTableColumn>
            </ElTable>
            <!-- 分页器 -->
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                @current-change="getHasTrademark" @size-change="change" />
        </ElCard>
        <!-- dialog组件 -->
        <ElDialog v-model="dialogVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'" style="max-width: 600px;">
            <ElForm style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formElRef">
                <ElFormItem label="品牌名称" label-width="100px" prop="tmName">
                    <ElInput placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></ElInput>
                </ElFormItem>
                <ElFormItem label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </ElFormItem>
            </ElForm>
            <template #footer>
                <ElButton type="primary" @click="cancel">取消</ElButton>
                <ElButton type="primary" @click="confirm">确定</ElButton>
            </template>
        </ElDialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqHasTrademark, reqAddOrUpdateTrademark } from '@/api/product/trademark/index';
import type { Records, Trademark } from '@/api/product/trademark/type';
import type { UploadProps, FormRules, FormInstance } from 'element-plus'

let pageNo = ref(1)
let limit = ref(3)
let total = ref(0)
let trademarkArr = ref<Records>([])
let loading = ref(false)
let dialogVisible = ref(false)
let trademarkParams = reactive<Trademark>({
    tmName: '',
    logoUrl: ''
})
let formElRef = ref<FormInstance>()

//获取商品列表
const getHasTrademark = async () => {
    loading.value = true
    let result = await reqHasTrademark(pageNo.value, limit.value)
    loading.value = false
    total.value = result.data.total
    trademarkArr.value = result.data.records
}

//改变每页条数
const change = () => {
    pageNo.value = 1 //当limit改变则跳转到第一页
    getHasTrademark()
}

//打开添加品牌对话框
const addTrademark = () => {
    dialogVisible.value = true
    trademarkParams.logoUrl = ''
    trademarkParams.tmName = ''
    trademarkParams.id = undefined

    nextTick(() => {
        formElRef.value?.resetFields()
    })
}

//打开修改品牌对话框
const updateTrademark = (row: Trademark) => {
    dialogVisible.value = true
    nextTick(() => {
        formElRef.value?.resetFields()
        Object.assign(trademarkParams, row)
    })
}

//取消
const cancel = () => {
    dialogVisible.value = false
}

//提交表单
const confirm = async () => {
    //表单校验
    let val = await formElRef.value?.validate().catch((error) => {
        console.log('表单验证不通过', error)
        return false
    })
    if (!val) return

    let msg = trademarkParams.id ? '修改品牌' : '添加品牌'
    let result = await reqAddOrUpdateTrademark(trademarkParams)
    dialogVisible.value = false

    if (result.code === 200) {
        ElMessage.success(`${msg}成功！`)
        getHasTrademark()
    } else {
        ElMessage.error(`${msg}失败：${result.message}`)
    }
}

onMounted(() => {
    getHasTrademark()
})

//图片上传成功回调
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    _uploadFile
) => {
    trademarkParams.logoUrl = response.data
    formElRef.value?.clearValidate('logoUrl') // 图片上传成功后清除表单验证红字
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
        ElMessage.error('上传图片类型必须为jpg、png、gif!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('上传图片大小必须小于2MB!')
        return false
    }
    return true
}

const validatorTmName = (_rule: any, value: string, callback: any) => {
    if (value.trim().length >= 2) {
        callback()
    } else {
        callback(new Error('品牌名称必须大于两位'))
    }
}

const validatorLogoUrl = (_rule: any, value: string, callback: any) => {
    if (value) {
        callback()
    } else {
        callback(new Error('必须上传LOGO'))
    }
}

const rules: FormRules = {
    tmName: [
        { required: true, trigger: 'blur', validator: validatorTmName }
    ],
    logoUrl: [
        { required: true, validator: validatorLogoUrl }
    ]
}

</script>

<script lang="ts">
export default {
    name: 'Trademark'
}
</script>

<style scoped>
.table {
    margin: 10px 0;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
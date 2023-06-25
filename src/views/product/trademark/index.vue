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
                    <template #="{}">
                        <ElButton type="primary" size="small" icon="Edit" @click="updateTrademark"></ElButton>
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
        <ElDialog v-model="dialogVisible" title="添加品牌" style="max-width: 600px;">
            <ElForm style="width: 80%;">
                <ElFormItem label="品牌名称" label-width="80px">
                    <ElInput placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></ElInput>
                </ElFormItem>
                <ElFormItem label="品牌LOGO" label-width="80px">
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
import { ref, onMounted, reactive } from 'vue';
import { reqHasTrademark, reqAddOrUpdateTrademark } from '@/api/product/trademark/index';
import type { Records, Trademark } from '@/api/product/trademark/type';
import type { UploadProps } from 'element-plus'

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

const getHasTrademark = async () => {
    loading.value = true
    let result = await reqHasTrademark(pageNo.value, limit.value)
    loading.value = false
    total.value = result.data.total
    trademarkArr.value = result.data.records
}

const change = () => {
    pageNo.value = 1 //当limit改变则跳转到第一页
    getHasTrademark()
}

const addTrademark = () => {
    dialogVisible.value = true
    trademarkParams.logoUrl = ''
    trademarkParams.tmName = ''
}

const updateTrademark = () => {
    dialogVisible.value = true
}

const cancel = () => {
    dialogVisible.value = false
}

const confirm = async () => {
    let result = await reqAddOrUpdateTrademark(trademarkParams)
    dialogVisible.value = false
    if(result.code === 200){
        ElMessage.success('添加品牌成功')
        getHasTrademark()
    }else{
        ElMessage.error(`添加品牌失败：${result.message}`)
    }
}

onMounted(() => {
    getHasTrademark()
})

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    _uploadFile
) => {
    trademarkParams.logoUrl = response.data
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
</script>

<script lang="ts">
export default {
    name: 'Trademark'
}
</script>

<style scoped>
.table{
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
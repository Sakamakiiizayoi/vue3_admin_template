<template>
    <div>
        <ElCard style="height: 75px;">
            <ElForm :inline="true" class="search" @submit.native.prevent>
                <ElFormItem label="用户名:">
                    <ElInput placeholder="请输入用户名搜索" v-model="keyword" @keydown.enter="search"></ElInput>
                </ElFormItem>
                <ElFormItem>
                    <ElButton type="primary" @click="search">搜索</ElButton>
                    <ElButton @click="reset">重置</ElButton>
                </ElFormItem>
            </ElForm>
        </ElCard>
        <ElCard style="margin-top: 10px;">
            <ElTable v-loading="tableLoading" border style="margin: 10px 0;" :data="userArr">
                <ElTableColumn label="ID" prop="id"></ElTableColumn>
                <ElTableColumn label="头像" width="75px">
                    <template #="{ row }">
                        <ElImage :src="row.headImg" style="width: 50px;" fit="cover"></ElImage>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="登录名称" prop="loginName" width="120px"></ElTableColumn>
                <ElTableColumn label="昵称" prop="nickName" width="120px"></ElTableColumn>
                <ElTableColumn label="名称" prop="name" width="120px"></ElTableColumn>
                <ElTableColumn label="手机号" prop="phoneNum" width="120px"></ElTableColumn>
                <ElTableColumn label="邮箱" prop="email" width="120px"></ElTableColumn>
                <ElTableColumn label="用户等级" prop="userLevel" width="82px"></ElTableColumn>
                <ElTableColumn label="状态" width="60px" align="center">
                    <template #="{ row }">
                        <div style="height: 24px; line-height: 24px;">
                            <el-icon size="24px" color="green" v-if="row.status">
                                <CircleCheckFilled />
                            </el-icon>
                            <el-icon size="24px" color="red" v-else>
                                <CircleCloseFilled />
                            </el-icon>
                        </div>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="生日" prop="birthday"></ElTableColumn>
                <ElTableColumn label="性别" width="55px" align="center">
                    <template #="{ row }">
                        <div v-if="row.gender">{{ row.gender === 'M' ? '男' : '女' }}</div>
                        <div v-else>未知</div>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="创建时间" prop="createTime" width="170px"></ElTableColumn>
                <ElTableColumn label="操作时间" prop="operateTime" width="170px"></ElTableColumn>
                <ElTableColumn label="操作" fixed="right" width="90px">
                    <template #="{ row }">
                        <ElButton size="small" :type="row.status ? 'danger' : 'success'"
                            :icon="row.status ? 'lock' : 'Unlock'" @click="lockUser(row)">{{ row.status ? '锁定' : '解锁' }}
                        </ElButton>
                    </template>
                </ElTableColumn>
            </ElTable>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[5, 7, 9, 11]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                @current-change="getHasUser" @size-change="sizeChange" />
        </ElCard>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { reqUserPage, reqUserLock } from '@/api/clientUser/index';
import type { User } from '@/api/clientUser//type';

//#region 分页列表展示相关
let tableLoading = ref(false)
let pageNo = ref(1)
let limit = ref(5)
let total = ref(0)
let userArr = ref<User[]>([])

onMounted(() => {
    getHasUser()
})

/**
 * 获取用户分页列表
 * @param page 
 */
const getHasUser = async (page = 1) => {
    pageNo.value = page
    tableLoading.value = true
    let result = await reqUserPage(pageNo.value, limit.value, keyword.value)
    tableLoading.value = false
    if (result.code === 200) {
        userArr.value = result.data.records
        total.value = result.data.total
    }
}

/**
 * 分页数量改变回调
 * @param pageSize 
 */
const sizeChange = (pageSize: number) => {
    limit.value = pageSize
    getHasUser()
}
//#endregion 分页列表展示相关

//#region 搜索栏相关
const keyword = ref('')

const search = () => {
    getHasUser()
}

const reset = () => {
    keyword.value = ''
    getHasUser()
}
//#endregion 搜索相关

//#region 用户锁相关
const lockUser = async (row: User) => {
    let result = await reqUserLock(row.id, row.status === 1 ? 0 : 1)
    if (result.code === 200) {
        ElMessage.success('操作成功')
        getHasUser(pageNo.value)
    } else {
        ElMessage.error(`操作失败：${result.message}|${result.data}`)
    }
}
//#endregion

</script>

<style scoped lang="scss">
.search {
    display: flex;
    justify-content: space-between;
}
</style>
<template>
    <div>
        <ElCard style="height: 75px;">
            <ElForm :inline="true" class="search">
                <ElFormItem label="用户名:">
                    <ElInput placeholder="请输入搜索用户名"></ElInput>
                </ElFormItem>
                <ElFormItem>
                    <ElButton type="primary">搜索</ElButton>
                    <ElButton>重置</ElButton>
                </ElFormItem>
            </ElForm>
        </ElCard>
        <ElCard style="margin-top: 10px;">
            <ElButton type="primary" @click="addUser">添加用户</ElButton>
            <ElButton type="danger">批量删除</ElButton>
            <ElTable v-loading="tableLoading" border style="margin: 10px 0;" :data="userArr">
                <ElTableColumn type="selection"></ElTableColumn>
                <ElTableColumn type="index" label="#"></ElTableColumn>
                <ElTableColumn label="ID" prop="id"></ElTableColumn>
                <ElTableColumn label="用户名字" prop="username"></ElTableColumn>
                <ElTableColumn label="用户昵称" prop="name"></ElTableColumn>
                <ElTableColumn label="用户角色" prop="roleName"></ElTableColumn>
                <ElTableColumn label="创建时间" prop="createTime"></ElTableColumn>
                <ElTableColumn label="更新时间" prop="updateTime"></ElTableColumn>
                <ElTableColumn label="操作" width="300px">
                    <template #="{ row }">
                        <ElButton size="small" type="primary" icon="User" @click="setRole(row)">分配角色</ElButton>
                        <ElButton size="small" type="warning" icon="Edit" @click="updateUser(row)">编辑</ElButton>
                        <ElButton size="small" type="danger" icon="Delete">删除</ElButton>
                    </template>
                </ElTableColumn>
            </ElTable>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[5, 7, 9, 11]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                @current-change="getHasUser" @size-change="sizeChange" />
        </ElCard>
        <el-drawer v-model="userEditDrawer" direction="rtl">
            <template #header>
                <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
            </template>
            <template #default>
                <ElForm ref="formRef" :model="userParams" :rules="rules">
                    <ElFormItem label="用户姓名" prop="username">
                        <ElInput placeholder="请输入用户姓名" v-model="userParams.username"></ElInput>
                    </ElFormItem>
                    <ElFormItem label="用户昵称" prop="name">
                        <ElInput placeholder="请输入用户昵称" v-model="userParams.name"></ElInput>
                    </ElFormItem>
                    <ElFormItem label="用户密码" prop="password" v-if="!userParams.id">
                        <ElInput placeholder="请输入用户密码" v-model="userParams.password"></ElInput>
                    </ElFormItem>
                </ElForm>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="save">确认</el-button>
                </div>
            </template>
        </el-drawer>
        <el-drawer v-model="setRoleDrawer" direction="rtl">
            <template #header>
                <h4>分配角色用户</h4>
            </template>
            <template #default>
                <ElForm>
                    <ElFormItem label="用户姓名">
                        <ElInput v-model="userRoleParams.username" :disabled="true"></ElInput>
                    </ElFormItem>
                    <ElFormItem label="职位列表">
                        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                            @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox-group v-model="userRole" @change="handleCheckedRoleChange">
                            <el-checkbox v-for="role in roles" :key="role" :label="role">{{
                                role
                            }}</el-checkbox>
                        </el-checkbox-group>
                    </ElFormItem>
                </ElForm>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="setRoleCancel">取消</el-button>
                    <el-button type="primary" @click="setRoleSave">确认</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqGetUser, reqAddOrUpdateUser } from '@/api/acl/user';
import type { User } from '@/api/acl/user/type';
import { FormRules, FormInstance, CheckboxValueType } from 'element-plus';

//#region 分页列表展示相关
let tableLoading = ref(false)
let pageNo = ref(1)
let limit = ref(5)
let total = ref(0)

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
    let result = await reqGetUser(pageNo.value, limit.value)
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

//#region 编辑添加用户相关
let userArr = ref<User[]>([])
let userEditDrawer = ref(false)
let userParams = reactive<User>({
    username: '',
    name: '',
    password: ''
})
let formRef = ref<FormInstance>()

/**
 * 添加用户按钮回调
 */
const addUser = () => {
    userEditDrawer.value = true
    //重置用户表单数据
    Object.assign(userParams, {
        id: undefined,
        username: '',
        name: '',
        password: ''
    })

    nextTick(() => {
        formRef.value!.clearValidate('username')
        formRef.value!.clearValidate('name')
        formRef.value!.clearValidate('password')
    })
}

/**
 * 编辑用户按钮回调
 * @param row 
 */
const updateUser = (row: User) => {
    userEditDrawer.value = true
    Object.assign(userParams, row)

    nextTick(() => {
        formRef.value!.clearValidate('username')
        formRef.value!.clearValidate('name')
        formRef.value!.clearValidate('password')
    })
}

/**
 * 取消按钮回调
 */
const cancel = () => {
    userEditDrawer.value = false
}

/**
 * 确认按钮回调
 */
const save = async () => {
    let re = await formRef.value!.validate().catch(() => {
        return false
    })
    if (!re) return

    let result = await reqAddOrUpdateUser(userParams)

    let msg = userParams.id ? '更新' : '添加'
    if (result.code === 200) {
        ElMessage.success(`${msg}成功!`)
        getHasUser(userParams.id ? pageNo.value : 1)
    } else {
        ElMessage.error(`${msg}失败:${result.message}|${result.data}`)
    }
    userEditDrawer.value = false
}

//自定义校验规则
const validatorPassword = (_rule: any, value: string, callback: any) => {
    if (value.length >= 6) {
        callback()
    } else {
        callback(new Error('密码至少为6位'))
    }
}

//表单校验规则
const rules = reactive<FormRules>({
    username: [
        { required: true, min: 5, max: 20, message: '用户名长度应为5-20位', trigger: 'blur' },
    ],
    name: [
        { required: true, min: 5, max: 20, message: '昵称长度应为5-20位', trigger: 'blur' },
    ],
    password: [
        // { required: true, min: 6, max: 15, message: '密码长度应为6-15位', trigger: 'blur' },
        { required: true, trigger: 'change', validator: validatorPassword }
    ]
})
//#endregion 编辑添加用户相关

//#region 分配角色相关
let userRoleParams = reactive({
    username: '',
    role: []
})
let setRoleDrawer = ref(false)
const checkAll = ref(false)
const isIndeterminate = ref(true)
const userRole = ref(['Shanghai', 'Beijing'])
const roles = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen']

const handleCheckAllChange = (val: CheckboxValueType) => {
    userRole.value = val ? roles : []
    isIndeterminate.value = false
}

const handleCheckedRoleChange = (val: CheckboxValueType[]) => {
    const checkedCount = val.length
    checkAll.value = checkedCount === roles.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < roles.length
}

/**
 * 分配角色按钮回调
 * @param row 
 */
const setRole = (row: User) => {
    setRoleDrawer.value = true
    userRoleParams.username = row.username
}

/**
 * 分配角色取消按钮回调
 */
const setRoleCancel = () => {

}

/**
 * 分配角色确认按钮回调
 */
const setRoleSave = () => {

}
//#endregion 分配角色相关
</script>

<style scoped lang="scss">
.search {
    display: flex;
    justify-content: space-between;
}
</style>
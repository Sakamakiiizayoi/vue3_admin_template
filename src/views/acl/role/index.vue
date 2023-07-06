<template>
    <div>
        <ElCard style="height: 75px;">
            <ElForm :inline="true" class="search" @submit.native.prevent>
                <ElFormItem label="角色名:">
                    <ElInput placeholder="请输入搜索角色名" v-model="keyword" @keydown.enter="search"></ElInput>
                </ElFormItem>
                <ElFormItem>
                    <ElButton type="primary" @click="search">搜索</ElButton>
                    <ElButton @click="reset">重置</ElButton>
                </ElFormItem>
            </ElForm>
        </ElCard>
        <ElCard style="margin-top: 10px;">
            <ElButton type="primary" @click="addRole" v-has="'btn.Role.add'">添加角色</ElButton>
            <ElTable v-loading="tableLoading" border style="margin: 10px 0;" :data="roleArr">
                <ElTableColumn type="index" label="#"></ElTableColumn>
                <ElTableColumn label="ID" prop="id"></ElTableColumn>
                <ElTableColumn label="角色名字" prop="roleName"></ElTableColumn>
                <ElTableColumn label="创建时间" prop="createTime"></ElTableColumn>
                <ElTableColumn label="更新时间" prop="updateTime"></ElTableColumn>
                <ElTableColumn label="操作" width="300px">
                    <template #="{ row }">
                        <ElButton size="small" type="primary" icon="User" @click="setPermission(row)" v-has="'btn.Role.assgin'">分配权限</ElButton>
                        <ElButton size="small" type="warning" icon="Edit" @click="updateRole(row)" v-has="'btn.Role.update'">编辑</ElButton>
                        <ElPopconfirm :title="`确认删除角色‘${row.roleName}’吗？`" width="250px" icon="Delete"
                            @confirm="deleteRole(row)">
                            <template #reference>
                                <ElButton size="small" type="danger" icon="Delete" v-has="'btn.Role.remove'">删除</ElButton>
                            </template>
                        </ElPopconfirm>
                    </template>
                </ElTableColumn>
            </ElTable>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[10, 15]" :background="true"
                layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasRole"
                @size-change="sizeChange" />
        </ElCard>
        <el-dialog v-model="dialogRoleVisible" :title="roleParams.id ? '更新角色' : '添加角色'">
            <ElForm ref="formRef" :model="roleParams" :rules="rules">
                <ElFormItem label="角色名：" prop="roleName">
                    <ElInput v-model="roleParams.roleName" placeholder="请输入角色名称"></ElInput>
                </ElFormItem>
            </ElForm>
            <template #footer>
                <ElButton @click="cancel">取消</ElButton>
                <ElButton type="primary" @click="save">确认</ElButton>
            </template>
        </el-dialog>
        <el-drawer v-model="setPermissionDrawer" direction="rtl">
            <template #header>
                <h4>分配角色权限</h4>
            </template>
            <template #default>
                <el-tree v-loading="treeLoading" ref="treeRef" :data="permissionsData" show-checkbox node-key="id"
                    default-expand-all :default-checked-keys="defaultCheckedKeys" :props="defaultProps" />
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="setPermissionCancel">取消</el-button>
                    <el-button type="primary" @click="setPermissionSave">确认</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqGetRole, reqAddOrUpdateRole, reqRemoveRole, reqGetRolePermissions, reqSetRolePermissions } from '@/api/acl/role';
import type { Role, Permission, PermissionVo } from '@/api/acl/role/type';
import { FormRules, FormInstance } from 'element-plus';

//#region 分页列表展示相关
let tableLoading = ref(false)
let pageNo = ref(1)
let limit = ref(10)
let total = ref(0)
let roleArr = ref<Role[]>([])

onMounted(() => {
    getHasRole()
})

/**
 * 获取用户分页列表
 * @param page 
 */
const getHasRole = async (page = 1) => {
    pageNo.value = page
    tableLoading.value = true
    let result = await reqGetRole(pageNo.value, limit.value, keyword.value)
    tableLoading.value = false
    if (result.code === 200) {
        roleArr.value = result.data.records
        total.value = result.data.total
    }
}

/**
 * 分页数量改变回调
 * @param pageSize 
 */
const sizeChange = (pageSize: number) => {
    limit.value = pageSize
    getHasRole()
}
//#endregion 分页列表展示相关

//#region 编辑添加角色相关
let dialogRoleVisible = ref(false)
let roleParams = reactive<Role>({
    roleName: '',
})
let formRef = ref<FormInstance>()

/**
 * 添加用户按钮回调
 */
const addRole = () => {
    dialogRoleVisible.value = true
    //重置用户表单数据
    Object.assign(roleParams, {
        roleName: ''
    })

    nextTick(() => {
        formRef.value!.clearValidate('roleName')
    })
}

/**
 * 编辑用户按钮回调
 * @param row 
 */
const updateRole = (row: Role) => {
    dialogRoleVisible.value = true
    Object.assign(roleParams, row)

    nextTick(() => {
        formRef.value!.clearValidate('roleName')
    })
}

/**
 * 添加或更新角色对话框的取消按钮回调
 */
const cancel = () => {
    dialogRoleVisible.value = false
}

/**
 * 添加或更新角色对话框的确认按钮回调
 */
const save = async () => {
    let re = await formRef.value!.validate().catch(() => {
        return false
    })
    if (!re) return

    let result = await reqAddOrUpdateRole(roleParams)

    let msg = roleParams.id ? '更新' : '添加'
    if (result.code === 200) {
        ElMessage.success(`${msg}成功!`)
        getHasRole(roleParams.id ? pageNo.value : 1)
    } else {
        ElMessage.error(`${msg}失败:${result.message}|${result.data}`)
    }
    dialogRoleVisible.value = false
}

//表单校验规则
const rules = reactive<FormRules>({
    roleName: [
        { required: true, min: 1, max: 20, message: '角色名长度应为1-20位', trigger: 'blur' },
    ]
})
//#endregion 编辑添加角色相关

//#region 分配权限相关
const defaultProps = {
    children: 'children',
    label: 'name',
}
const permissionsData = ref<Permission[]>([])
const treeRef = ref<any>()
let setPermissionDrawer = ref(false)
let treeLoading = ref(false)
let defaultCheckedKeys = ref<number[]>([])

/**
 * 通过角色id获取菜单权限
 * @param roleId 
 */
const getPermissionsByRoleId = async (roleId: number) => {
    permissionsData.value = []
    treeLoading.value = true
    let result = await reqGetRolePermissions(roleId)
    treeLoading.value = false
    if (result.code === 200) {
        permissionsData.value = result.data
    } else {
        ElMessage.error(`获取角色权限信息失败：${result.message}|${result.data}`)
    }
}

/**
 * 分配角色按钮回调
 * @param row 
 */
const setPermission = async (row: Role) => {
    Object.assign(roleParams, row)
    setPermissionDrawer.value = true
    await getPermissionsByRoleId(row.id!)
    defaultCheckedKeys.value = filterSelectIds(permissionsData.value)
}

/**
 * 过滤出当前选中的四级节点id
 * @param allArr 
 * @param initArr 
 */
const filterSelectIds = (allArr: Permission[], initArr = <number[]>[]) => {
    allArr.forEach((item) => {
        if (item.level === 4 && item.select) initArr.push(item.id)
        if (item.children && item.children.length > 0) filterSelectIds(item.children, initArr)
    })
    return initArr
}

/**
 * 分配角色取消按钮回调
 */
const setPermissionCancel = () => {
    setPermissionDrawer.value = false
}

/**
 * 分配角色确认按钮回调
 */
const setPermissionSave = async () => {
    let ids1: number[] = treeRef.value.getHalfCheckedKeys()
    let ids2: number[] = treeRef.value.getCheckedKeys()
    let params: PermissionVo = {
        permissionIdList: ids1.concat(ids2),
        roleId: roleParams.id!
    }

    let result = await reqSetRolePermissions(params)
    if (result.code === 200) {
        ElMessage.success('分配角色权限成功！')
        window.location.reload()
    } else {
        ElMessage.error(`分配角色权限失败：${result.message}|${result.data}`)
    }
}
//#endregion 分配权限相关

//#region 删除角色相关
/**
 * 删除用户按钮回调
 * @param row 
 */
const deleteRole = async (row: Role) => {
    let result = await reqRemoveRole(row.id!)
    if (result.code === 200) {
        ElMessage.success('删除角色成功！')
        getHasRole(roleArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage.error('删除角色失败：' + `${result.message}|${result.data}`)
    }
}
//#endregion 删除角色相关

//#region 搜索栏相关
const keyword = ref('')

const search = () => {
    getHasRole()
}

const reset = () => {
    keyword.value = ''
    getHasRole()
}
//#endregion 搜索相关
</script>

<style scoped lang="scss">
.search {
    display: flex;
    justify-content: space-between;
}
</style>
<template>
    <ElCard>
        <ElTable v-loading="loading" border row-key="id" :data="permissionArr" :expand-row-keys="expandKeys">
            <ElTableColumn label="名称" prop="name"></ElTableColumn>
            <ElTableColumn label="权限值" prop="code"></ElTableColumn>
            <ElTableColumn label="修改时间" prop="updateTime"></ElTableColumn>
            <ElTableColumn label="操作">
                <template #="{ row }">
                    <ElButton type="primary" size="small" icon="Plus" :disabled="row.level === 4 ? true : false"
                        @click="addPermission(row)">{{
                            row.level === 3 ? '添加功能' : '添加菜单' }}
                    </ElButton>
                    <ElButton type="warning" size="small" icon="Edit" @click="updatePermission(row)">编辑
                    </ElButton>
                    <ElPopconfirm :title="`确认删除'${row.name}'？`" @confirm="removePermission(row)" width="250px">
                        <template #reference>
                            <ElButton type="danger" size="small" icon="Delete">删除
                            </ElButton>
                        </template>
                    </ElPopconfirm>
                </template>
            </ElTableColumn>
        </ElTable>
        <el-dialog v-model="dialogFormVisible" title="添加菜单">
            <el-form>
                <el-form-item label="名称">
                    <el-input placeholder="请输入菜单名称" v-model="menuData.name" />
                </el-form-item>
                <el-form-item label="权限">
                    <el-input placeholder="请输入权限值" v-model="menuData.code" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="save">
                    确认
                </el-button>
            </template>
        </el-dialog>
    </ElCard>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { reqGetPermission, reqRemovePermission, reqAddOrUpdatePer } from '@/api/acl/menu';
import type { Permission, MenuParams } from '@/api/acl/menu/type';

//#region table数据展示相关
const loading = ref(false)
const permissionArr = ref<Permission[]>([])
const expandKeys = ref(['1'])

onMounted(() => {
    getHasPermission()
})

/**
 * 获取菜单权限列表
 */
const getHasPermission = async () => {
    loading.value = true
    let result = await reqGetPermission()
    loading.value = false
    if (result.code === 200) {
        permissionArr.value = result.data
    }
}

//#endregion table数据展示相关

//#region 添加编辑菜单相关
const dialogFormVisible = ref(false)
const menuData = reactive<MenuParams>({
    name: '',
    code: '',
    level: 0,
    pid: 0
})

/**
 * 添加菜单按钮回调
 * @param row 
 */
const addPermission = (row: Permission) => {
    dialogFormVisible.value = true
    Object.assign(menuData, {
        id: undefined,
        name: '',
        code: '',
        level: row.level + 1,
        pid: row.id
    })
}

/**
 * 编辑菜单按钮回调
 * @param row 
 */
const updatePermission = (row: Permission) => {
    dialogFormVisible.value = true
    Object.assign(menuData, row)
}

/**
 * 编辑窗口确认按钮回调
 */
const save = async () => {
    let msg = menuData.id ? '更新' : '添加'
    let result = await reqAddOrUpdatePer(menuData)
    if (result.code === 200) {
        ElMessage.success(`${msg}成功！`)
        getHasPermission()
        dialogFormVisible.value = false
    } else {
        ElMessage.error(`${msg}失败:${result.message}|${result.data}`)
    }
}
//#endregion 添加编辑菜单相关

//#region 删除菜单相关
/**
 * 删除惨淡权限方法
 * @param row 
 */
const removePermission = async (row: Permission) => {
    let result = await reqRemovePermission(row.id)
    if (result.code === 200) {
        ElMessage.success('删除成功！')
        getHasPermission()
    } else {
        ElMessage.error(`删除失败：${result.message}|${result.data}`)
    }
}
//#endregion 删除菜单相关
</script>

<style scoped lang="">

</style>
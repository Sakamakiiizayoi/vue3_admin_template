<template>
    <div>
        <Category :scene="scene" />
        <el-card style="margin-top: 10px;">
            <div v-show="scene === 0">
                <ElButton type="primary" icon="Plus" @click="addAttrHandler" :disabled="categoryStore.c3Id ? false : true">添加平台属性
                </ElButton>
                <ElTable v-loading="loading" :border="true" class="table" :data="attrArr">
                    <ElTableColumn label="序号" width="80px" align="center" type="index"></ElTableColumn>
                    <ElTableColumn label="属性名称" width="120px" prop="attrName"></ElTableColumn>
                    <ElTableColumn label="属性值名称">
                        <template #="{ row }">
                            <ElTag style="margin: 0 5px 0 0;" v-for="(item, index) in row.attrValueList" :key="index">{{
                                item.valueName }}</ElTag>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn label="操作" width="120px">
                        <template #="{ row }">
                            <ElButton type="primary" size="small" icon="Edit" @click=""></ElButton>
                            <ElPopconfirm :title="`确认删除${row.attrName}属性？`" width="250px" icon="Delete" @confirm="">
                                <template #reference>
                                    <ElButton type="primary" size="small" icon="Delete"></ElButton>
                                </template>
                            </ElPopconfirm>
                        </template>
                    </ElTableColumn>
                </ElTable>
            </div>
            <div v-show="scene === 1">
                <ElForm :inline="true">
                    <ElFormItem label="属性名称"><ElInput placeholder="请输入属性的名称"></ElInput></ElFormItem>
                </ElForm>
                <ElButton type="primary" icon="Plus">添加属性值</ElButton>
                <ElButton @click="cancel">取消</ElButton>
                <ElTable border style="margin: 10px 0;">
                    <ElTableColumn label="序号" type="index" width="80px"></ElTableColumn>
                    <ElTableColumn label="属性值名称"></ElTableColumn>
                    <ElTableColumn label="属性值操作"></ElTableColumn>
                </ElTable>
                <ElButton type="primary" icon="Check">保存</ElButton>
                <ElButton @click="cancel">取消</ElButton>

            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import useCategoryStore from '@/store/modules/category';
import { reqAttr } from '@/api/product/attr';
import type { AttrData } from '@/api/product/attr/type';
let categoryStore = useCategoryStore()

let loading = ref(false)
let attrArr = ref<AttrData[]>([])
let scene = ref(0)

watch(categoryStore, () => {
    getAttr()
})

const getAttr = async () => {
    let { c1Id, c2Id, c3Id } = categoryStore
    if (!c1Id || !c2Id || !c3Id) return
    loading.value = true
    let result = await reqAttr(c1Id, c2Id, c3Id)
    loading.value = false
    if (result.code === 200) {
        attrArr.value = result.data
    }
}

const addAttrHandler = () => {
    scene.value = 1
}

const cancel = () => {
    scene.value = 0
}
</script>

<style scoped lang="scss">
.table {
    margin-top: 10px;
}
</style>
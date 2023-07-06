<template>
    <div>
        <Category :scene="scene" />
        <el-card style="margin-top: 10px;">
            <div v-show="scene === 0">
                <ElButton type="primary" icon="Plus" @click="addAttrHandler" :disabled="categoryStore.c3Id ? false : true" v-has="'btn.Attr.add'">
                    添加平台属性
                </ElButton>
                <ElTable v-loading="loading" :border="true" class="table" :data="attrArr">
                    <ElTableColumn label="序号" width="80px" align="center" type="index"></ElTableColumn>
                    <ElTableColumn label="属性名称" width="120px" prop="attrName"></ElTableColumn>
                    <ElTableColumn label="属性值名称">
                        <template #="{ row }">
                            <ElTag style="margin: 2px 5px 2px 0;" v-for="(item, index) in row.attrValueList" :key="index"
                                :type="index % 2 === 1 ? 'warning' : 'success'">{{
                                    item.valueName }}</ElTag>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn label="操作" width="120px">
                        <template #="{ row }">
                            <ElButton type="warning" size="small" icon="Edit" @click="updateAttr(row)" v-has="'btn.Attr.update'"></ElButton>
                            <ElPopconfirm :title="`确认删除${row.attrName}属性？`" width="250px" icon="Delete"
                                @confirm="deleteAttr(row.id)">
                                <template #reference>
                                    <ElButton type="danger" size="small" icon="Delete" v-has="'btn.Attr.remove'"></ElButton>
                                </template>
                            </ElPopconfirm>
                        </template>
                    </ElTableColumn>
                </ElTable>
            </div>
            <div v-show="scene === 1">
                <ElForm :inline="true">
                    <ElFormItem label="属性名称">
                        <ElInput placeholder="请输入属性的名称" v-model="attrParams.attrName"></ElInput>
                    </ElFormItem>
                </ElForm>
                <ElButton type="primary" @click="addAttrValue" icon="Plus" :disabled="attrParams.attrName ? false : true">
                    添加属性值</ElButton>
                <ElButton @click="cancel">取消</ElButton>
                <ElTable border style="margin: 10px 0;" :data="attrParams.attrValueList">
                    <ElTableColumn label="序号" type="index" width="80px" align="center"></ElTableColumn>
                    <ElTableColumn label="属性值名称">
                        <template #="{ row, $index }">
                            <ElInput size="small" v-if="row.flag" v-model="row.valueName" @blur="toLock(row, $index)"
                                @keydown.enter="elInputArr[$index].blur()" placeholder="请输入属性值名称"
                                :ref="(el: any) => elInputArr[$index] = el"></ElInput>
                            <div style="cursor: pointer;" v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn label="属性值操作">
                        <template #="{ index }">
                            <ElButton type="danger" icon="Delete" size="small"
                                @click="attrParams.attrValueList.splice(index, 1)"></ElButton>
                        </template>
                    </ElTableColumn>
                </ElTable>
                <ElButton type="primary" icon="Check" @click="save">保存</ElButton>
                <ElButton @click="cancel">取消</ElButton>

            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue';
import useCategoryStore from '@/store/modules/category';
import { reqAddOrUpdateAttr, reqAttr, reqDeleteAttr } from '@/api/product/attr';
import type { AttrData, AttrValue } from '@/api/product/attr/type';
import type { InputInstance } from 'element-plus';
let categoryStore = useCategoryStore()

let loading = ref(false)
let attrArr = ref<AttrData[]>([])
let scene = ref(0)
let attrParams = reactive<AttrData>({
    attrName: '',
    categoryId: undefined,
    categoryLevel: 3,
    attrValueList: []
})
let elInputArr = <InputInstance[]>[]


watch(categoryStore, () => {
    getAttr()
})

/**
 * 获取属性
 */
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
    //清空数据
    Object.assign(attrParams, {
        attrName: '',
        categoryId: categoryStore.c3Id,
        categoryLevel: 3,
        attrValueList: []
    })
    scene.value = 1
}

const addAttrValue = () => {
    attrParams.attrValueList.push({
        valueName: '', flag: true
    })
    nextTick(() => {
        elInputArr[attrParams.attrValueList.length - 1].focus()
    })
}

const cancel = () => {
    scene.value = 0
}

const save = async () => {
    let result = await reqAddOrUpdateAttr(attrParams)
    let msg = attrParams.id ? '修改' : '添加'
    if (result.code === 200) {
        scene.value = 0 //跳转回属性
        ElMessage.success(`${msg}成功`)
        getAttr() //重新获取属性
    } else {
        ElMessage.error(`${msg}失败：${result.message}`)
    }
}

/**
 * 退出编辑属性值模式
 * @param row AttrValue
 * @param index AttrValue索引值
 */
const toLock = (row: AttrValue, index: number) => {
    //不能为空
    if (!row.valueName) {
        ElMessage.error('属性值不能为空')
        attrParams.attrValueList.splice(index, 1)
        return
    }
    //不能重复
    let repeat = attrParams.attrValueList.find((item, i) => {
        if (i !== index) {
            return item.valueName === row.valueName
        }
    })
    if (repeat) {
        ElMessage.error('属性值不能重复')
        attrParams.attrValueList.splice(index, 1)
        return
    }
    row.flag = false
}

const toEdit = (row: AttrValue, index: number) => {
    row.flag = true
    nextTick(() => {
        elInputArr[index].focus()
    })
}

const updateAttr = (row: AttrData) => {
    scene.value = 1
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

const deleteAttr = async (attrId: number) => {
    let result = await reqDeleteAttr(attrId)
    if (result.code === 200) {
        ElMessage.success('删除成功！')
        getAttr()
    } else {
        ElMessage.error('删除失败！' + result.message)
    }
}

//路由销毁时清空分类仓库数据
onBeforeUnmount(() => {
    categoryStore.$reset()
})
</script>

<script lang="ts">
export default {
    name: 'Attr'
}
</script>

<style scoped lang="scss">
.table {
    margin-top: 10px;
}
</style>
<template>
    <el-card>
        <el-form :inline="true">
            <ElFormItem label="一级分类">
                <ElSelect v-model="categoryStore.c1Id" @change="select1Change" :disabled="scene === 0 ? false : true">
                    <el-option v-for="(item, _index) in categoryStore.c1Arr" :key="item.id" :label="item.name"
                        :value="item.id" />
                </ElSelect>
            </ElFormItem>
            <ElFormItem label="二级分类">
                <ElSelect v-model="categoryStore.c2Id" @change="select2Change"
                    :disabled="categoryStore.c2Arr.length > 0 && scene === 0 ? false : true">
                    <el-option v-for="(item, _index) in categoryStore.c2Arr" :key="item.id" :label="item.name"
                        :value="item.id" />
                </ElSelect>
            </ElFormItem>
            <ElFormItem label="三级分类">
                <ElSelect v-model="categoryStore.c3Id"
                    :disabled="categoryStore.c3Arr.length > 0 && scene === 0 ? false : true">
                    <el-option v-for="(item, _index) in categoryStore.c3Arr" :key="item.id" :label="item.name"
                        :value="item.id" />
                </ElSelect>
            </ElFormItem>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useCategoryStore from '@/store/modules/category';

let categoryStore = useCategoryStore()
defineProps(['scene'])

onMounted(() => {
    getC1()
})

const getC1 = () => {
    categoryStore.getC1()
}

const select1Change = () => {
    categoryStore.c2Arr = []
    categoryStore.c2Id = undefined
    categoryStore.c3Arr = []
    categoryStore.c3Id = undefined
    categoryStore.getC2()
}

const select2Change = () => {
    categoryStore.c3Arr = []
    categoryStore.c3Id = undefined
    categoryStore.getC3()
}
</script>

<style scoped lang="">

</style>
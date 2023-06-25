<template>
    <el-card>
        <el-form :inline="true">
            <ElFormItem label="一级分类">
                <ElSelect>
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                </ElSelect>
            </ElFormItem>
            <ElFormItem label="二级分类">
                <ElSelect>
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                </ElSelect>
            </ElFormItem>
            <ElFormItem label="三级分类">
                <ElSelect>
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                </ElSelect>
            </ElFormItem>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">

</script>

<style scoped lang="">

</style>
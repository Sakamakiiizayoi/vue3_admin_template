<template>
    <div>
        <ElForm v-loading="loading" label-width="100px">
            <ElFormItem label="SPU名称">
                <ElInput placeholder="请输入SPU名称" v-model="spuParams.spuName"></ElInput>
            </ElFormItem>
            <ElFormItem label="SPU品牌">
                <ElSelect v-model="spuParams.tmId">
                    <ElOption v-for="(item, _index) in allTradeMark" :key="item.id" :label="item.tmName" :value="item.id">
                    </ElOption>
                </ElSelect>
            </ElFormItem>
            <ElFormItem label="SPU描述">
                <ElInput type="textarea" placeholder="请输入SPU描述" v-model="spuParams.description"></ElInput>
            </ElFormItem>
            <ElFormItem label="SPU图片">
                <el-upload v-model:file-list="fileList" action="/api/admin/product/fileUpload" list-type="picture-card"
                    :on-preview="handlePictureCardPreview" :on-success="handleSuccess" :before-upload="beforeUpload">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>

                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;" />
                </el-dialog>
            </ElFormItem>
            <ElFormItem label="SPU销售属性">
                <ElSelect :placeholder="`剩余${unUseSaleAttr.length}个属性`" v-model="selectSaleAttrId">
                    <ElOption v-for="(item, _index) in unUseSaleAttr" :key="item.id" :label="item.name" :value="item.id">
                    </ElOption>
                </ElSelect>
                <ElButton style="margin-left: 10px;" type="primary" icon="Plus" :disabled="selectSaleAttrId ? false : true"
                    @click="addSaleAttr">
                    添加销售属性</ElButton>
                <!-- table展示销售属性的地方 -->
                <ElTable border style="margin-top: 10px;" :data="saleAttrArr">
                    <ElTableColumn label="序号" type="index" align="center" width="80px"></ElTableColumn>
                    <ElTableColumn label="销售属性名字" width="120px" prop="saleAttrName"></ElTableColumn>
                    <ElTableColumn label="销售属性值">
                        <template #="{ row, $index }">
                            <ElTag @close="row.spuSaleAttrValueList.splice(index, 1)" style="margin-right: 10px;" closable
                                v-for="(item, index) in row.spuSaleAttrValueList" :key="index">{{ item.saleAttrValueName }}
                            </ElTag>

                            <ElInput :ref="el => inputArr[$index] = el as any" v-model="row.inputValue" v-if="row.inputFlag"
                                style="width: 100px;" size="small" placeholder="请输入属性值" @blur="toDone(row, $index)"
                                @keydown.enter="inputArr[$index].blur()"></ElInput>
                            <ElButton v-else type="primary" icon="Plus" size="small" @click="addSaleAttrValue(row, $index)">
                            </ElButton>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn label="操作" width="120px">
                        <template #="{ $index }">
                            <ElButton type="warning" size="small" icon="Delete" @click="saleAttrArr.splice($index, 1)">
                            </ElButton>
                        </template>
                    </ElTableColumn>
                </ElTable>
            </ElFormItem>
            <ElFormItem>
                <ElButton type="primary" @click="save">保存</ElButton>
                <ElButton @click="cancel">取消</ElButton>
            </ElFormItem>
        </ElForm>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, reactive } from 'vue';
import { reqAddOrUpdateSpu, reqAllSaleAttr, reqAllTradeMark, reqSpuHasSaleAttr, reqSpuImageList } from '@/api/product/spu';
import type { SpuData, SpuImg, TradeMark, SaleAttr, HasSaleAttr } from '@/api/product/spu/type';
import type { InputInstance, UploadProps, UploadUserFile } from 'element-plus'
let emit = defineEmits(['changeScene'])

let loading = ref(false)
let dialogVisible = ref(false)
let dialogImageUrl = ref('')
let allTradeMark = ref<TradeMark[]>([])
let imgList = ref<SpuImg[]>([])
let fileList = ref<UploadUserFile[]>([])
let saleAttrArr = ref<SaleAttr[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])
let selectSaleAttrId = ref<number | undefined>(undefined)

let spuParams = reactive<SpuData>({
    category3Id: undefined,
    spuName: '',
    description: '',
    tmId: undefined,
    spuImageList: [],
    spuSaleAttrList: []
})

let inputArr = <InputInstance[]>[]

/**
 * 属性值输入框失去焦点回调
 */
const toDone = (row: SaleAttr, index: number) => {
    let repeat = row.spuSaleAttrValueList.find((item) => {
        return item.saleAttrValueName === row.inputValue
    })
    if (repeat) {
        ElMessage.error('销售属性值不能重复')
        row.inputValue = ''
        row.inputFlag = false
        return
    }

    if (row.inputValue) {
        row.spuSaleAttrValueList.push({
            baseSaleAttrId: row.baseSaleAttrId!,
            saleAttrValueName: row.inputValue!
        })
        row.inputValue = ''
        nextTick(() => {
            inputArr[index].focus()
        })
    } else {
        row.inputFlag = false
    }
}

/**
 * 未选择的销售属性
 */
let unUseSaleAttr = computed(() => {
    let unUse = allSaleAttr.value.filter((it) => {
        return saleAttrArr.value.every((item) => {
            return item.saleAttrName !== it.name
        })
    })
    return unUse
})

/**
 * 添加销售属性值
 */
const addSaleAttrValue = (row: SaleAttr, index: number) => {
    row.inputFlag = true
    nextTick(() => {
        inputArr[index].focus()
    })
}

/**
 * 添加销售属性
 */
const addSaleAttr = () => {
    if (!selectSaleAttrId.value) return
    let a = allSaleAttr.value.find((item) => {
        return item.id === selectSaleAttrId.value
    })!
    saleAttrArr.value.push({
        baseSaleAttrId: a.id,
        saleAttrName: a.name,
        spuSaleAttrValueList: []
    })
    selectSaleAttrId.value = undefined
}

/**
 * 保存按钮回调
 */
const save = async () => {
    spuParams.spuImageList = fileList.value.map((item: any) => {
        return {
            imgName: item.name,
            imgUrl: item.response ? item.response.data : item.url
        }
    })
    spuParams.spuSaleAttrList = saleAttrArr.value
    let result = await reqAddOrUpdateSpu(spuParams)

    let msg = spuParams.id ? '修改' : '添加'

    if (result.code === 200) {
        ElMessage.success(msg + '成功！')
        if(spuParams.id){
            emit('changeScene', 0, true)
        }else{
            emit('changeScene', 0, false)
        }
        resetData()
    } else {
        ElMessage.error(msg + '失败:' + result.message + result.data)
    }

}

/**
 * 取消返回场景
 */
const cancel = () => {
    emit('changeScene', 0, true)
    resetData()
}

/**
 * 更新spu-初始化加载spu数据 获取照片、销售属性等
 * @param spu 
 */
const initHasSpuData = async (spu: SpuData) => {
    Object.assign(spuParams, spu)
    loading.value = true
    let result = await reqAllTradeMark()
    let result1 = await reqSpuImageList(spu.id!)
    let result2 = await reqSpuHasSaleAttr(spu.id!)
    let result3 = await reqAllSaleAttr()
    loading.value = false
    allTradeMark.value = result.data
    imgList.value = result1.data
    saleAttrArr.value = result2.data
    allSaleAttr.value = result3.data
    fileList.value = imgList.value.map(({ imgName, imgUrl }) => {
        return {
            name: imgName!,
            url: imgUrl!
        }
    })
}

/**
 * 重置表单数据
 */
const resetData = () => {
    // 重置数据
    Object.assign(spuParams, {
        category3Id: undefined,
        spuName: '',
        description: '',
        tmId: undefined,
        spuImageList: [],
        spuSaleAttrList: []
    })
    selectSaleAttrId.value = undefined
    fileList.value = []
    saleAttrArr.value = []
}

/**
 * 添加spu
 * @param spu 
 */
const initAddSpuData = async (c3Id: number) => {
    // 重置数据
    resetData()

    spuParams.category3Id = c3Id
    loading.value = true
    //获取所有品牌和销售属性
    let result = await reqAllTradeMark()
    let result3 = await reqAllSaleAttr()
    loading.value = false

    allTradeMark.value = result.data
    allSaleAttr.value = result3.data

}

/**
 * 照片预览回调
 * @param e 
 */
const handlePictureCardPreview: UploadProps['onPreview'] = (e) => {
    dialogImageUrl.value = e.url!
    dialogVisible.value = true
}

/**
 * 图片上传成功回调
 */
const handleSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    uploadFile.response = response
}

/**
 * 图片上传验证
 */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
        ElMessage.error('上传图片类型必须为jpg、png、gif!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('上传图片大小必须小于2MB!')
        return false
    }
    return true
}
defineExpose({ initHasSpuData, initAddSpuData })
</script>

<style scoped lang="">

</style>
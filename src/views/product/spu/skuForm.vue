<template>
    <div>
        <ElForm label-width="100px">
            <ElFormItem label="SKU名称">
                <ElInput placeholder="请输入SKU名称" v-model="skuParams.skuName"></ElInput>
            </ElFormItem>
            <ElFormItem label="价格（元）">
                <ElInput type="number" placeholder="价格（元）" v-model.number="skuParams.price"></ElInput>
            </ElFormItem>
            <ElFormItem label="重量（克）">
                <ElInput type="number" placeholder="重量（克）" v-model="skuParams.weight"></ElInput>
            </ElFormItem>
            <ElFormItem label="SKU描述">
                <ElInput type="textarea" placeholder="请输入SKU描述" v-model="skuParams.skuDesc"></ElInput>
            </ElFormItem>
            <ElFormItem label="平台属性">
                <ElForm :inline="true">
                    <ElFormItem :label="attr.attrName" v-for="(attr, _index) in attrArr" :key="attr.id">
                        <ElSelect v-model="attr.selectAttrValueId">
                            <ElOption v-for="(attrValue, _index) in attr.attrValueList" :key="attrValue.id"
                                :label="attrValue.valueName" :value="attrValue.id!"></ElOption>
                        </ElSelect>
                    </ElFormItem>
                </ElForm>
            </ElFormItem>
            <ElFormItem label="销售属性">
                <ElForm :inline="true">
                    <ElFormItem :label="sale.saleAttrName" v-for="(sale, _index) in saleArr" :key="sale.id">
                        <ElSelect v-model="sale.selectSaleAttrValueId">
                            <ElOption v-for="(SaleAttrValue, _index) in sale.spuSaleAttrValueList" :key="SaleAttrValue.id"
                                :label="SaleAttrValue.saleAttrValueName" :value="SaleAttrValue.id!"></ElOption>
                        </ElSelect>
                    </ElFormItem>
                </ElForm>
            </ElFormItem>
            <ElFormItem label="图片名称">
                <ElTable ref="imgTableRef" border :data="imgArr">
                    <ElTableColumn type="selection" width="80px" align="center"></ElTableColumn>
                    <ElTableColumn label="图片">
                        <template #="{ row }">
                            <ElImage style="width: 100px;" :src="row.imgUrl"></ElImage>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn label="名称" prop="imgName"></ElTableColumn>
                    <ElTableColumn label="操作">
                        <template #="{ row }">
                            <ElButton type="warning" size="small" @click="setDefaultImg(row)">设为默认</ElButton>
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
import { ref, reactive } from 'vue'
import { reqAttr } from '@/api/product/attr';
import { AttrData } from '@/api/product/attr/type';
import { reqSpuHasSaleAttr, reqSpuImageList, reqAddSku } from '@/api/product/spu';
import type { SaleAttr, SpuData, SpuImg, SkuData } from '@/api/product/spu/type';
import { TableInstance } from 'element-plus';

let imgTableRef = ref<TableInstance>()
let attrArr = ref<AttrData[]>([])
let saleArr = ref<SaleAttr[]>([])
let imgArr = ref<SpuImg[]>([])
let skuParams = reactive<SkuData>({
    category3Id: undefined,
    skuName: '',
    id: undefined,
    price: undefined,
    spuId: undefined,
    tmId: undefined,
    skuDefaultImg: '',
    skuDesc: '',
    weight: '',
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
})

let emit = defineEmits(['changeScene'])

/**
 * 取消按钮回调
 */
const cancel = () => {
    emit('changeScene', 0)
}

/**
 * 初始化获取数据
 */
const initSkuData = async (c1Id: number, c2Id: number, row: SpuData) => {
    //清空属性
    Object.assign(skuParams, {
        category3Id: undefined,
        skuName: '',
        id: undefined,
        price: undefined,
        spuId: undefined,
        tmId: undefined,
        skuDefaultImg: '',
        skuDesc: '',
        weight: '',
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
    })
    attrArr.value = []
    saleArr.value = []
    imgArr.value = []

    //平台属性
    let re1 = await reqAttr(c1Id, c2Id, row.category3Id!)
    //销售属性
    let re2 = await reqSpuHasSaleAttr(row.id!)
    //照片
    let re3 = await reqSpuImageList(row.id!)
    attrArr.value = re1.data
    saleArr.value = re2.data
    imgArr.value = re3.data
}

/**
 * 保存按钮回调
 */
const save = async () => {
    skuParams.skuAttrValueList = attrArr.value.reduce((prev, cur) => {
        if (cur.selectAttrValueId) {
            prev.push({
                attrId: cur.id!,
                valueId: cur.selectAttrValueId
            })
        }
        return prev
    }, <{ attrId: number, valueId: number }[]>[])
    skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev, cur) => {
        if (cur.selectSaleAttrValueId) {
            prev.push({
                saleAttrId: cur.id!,
                saleAttrValueId: cur.selectSaleAttrValueId
            })
        }
        return prev
    }, <{ saleAttrId: number, saleAttrValueId: number }[]>[])
    let result = await reqAddSku(skuParams)
    if (result.code === 200) {
        ElMessage.success('添加成功')
        emit('changeScene', 0, true, false)
    } else {
        ElMessage.error('添加失败' + result.message + result.data)
    }
}

/**
 * 设置默认图片按钮回调
 * @param row 
 */
const setDefaultImg = (row: SpuImg) => {
    imgArr.value.forEach((item) => {
        imgTableRef.value?.toggleRowSelection(item, false)
    })
    imgTableRef.value?.toggleRowSelection(row, true)
    skuParams.skuDefaultImg = row.imgUrl
}

defineExpose({ initSkuData })
</script>

<style scoped lang="">

</style>
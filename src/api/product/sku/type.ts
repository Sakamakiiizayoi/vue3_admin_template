export type ResponseData = {
    code: number
    message: string
    ok: boolean,
    data?: any
}
export type SkuData = {
    category3Id?: number
    createTime?: string
    skuName: string
    id?: number
    isSale?: number
    price?: number
    spuId?: number //spuid
    tmId?: number //品牌id
    skuDefaultImg: string
    skuDesc: string
    weight: string
    skuAttrValueList?: Array<{
        id: number
        attrId: number
        valueId: number
        attrName: string
        valueName: string
    }>
    skuImageList?: Array<{
        id: number
        imgName: string
        imgUrl: string
        isDefault: string
        skuId: number
        spuImgId: number
    }>
    skuSaleAttrValueList?: Array<{
        id: number
        saleAttrId: number
        saleAttrValueId: number
        saleAttrName: string
        saleAttrValueName: string
    }>
}

export interface SkuListResponse extends ResponseData {
    data: {
        records: SkuData[]
        total: number
        size: number
        current: number
        searchCount: boolean
        pages: number
    }
}

export interface GetSkuResponse extends ResponseData {
    data: SkuData
}
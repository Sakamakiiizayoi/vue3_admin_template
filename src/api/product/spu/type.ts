export type ResponseData = {
    code: number
    message: string
    ok: boolean,
    data?: any
}

export type SpuData = {
    category3Id?: number
    createTime?: string
    updateTime?: string
    description: string
    id?: number
    spuImageList?: SpuImg[]
    spuName: string
    spuPosterList?: any[]
    spuSaleAttrList?: SaleAttr[]
    tmId?: number
}

export type Records = SpuData[]

export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        searchCount: boolean
        pages: number
    }
}

export type TradeMark = {
    id: number
    tmName: string
    logoUrl: string
}

export interface AllTradeMarkResponseDate extends ResponseData {
    data: TradeMark[]
}

export type SpuImg = {
    id?: number,
    createTime?: string,
    updateTime?: string,
    spuId?: number,
    imgName: string,
    imgUrl: string
}

export interface SpuImageListResponseData extends ResponseData {
    data: SpuImg[]
}

export type SaleAttrValue = {
    id?: number
    spuId?: number
    baseSaleAttrId: number
    saleAttrValueName: string
    saleAttrName?: string
    isChecked?: null
}

export type SaleAttr = {
    id?: number
    spuId?: number
    baseSaleAttrId: number
    saleAttrName: string
    spuSaleAttrValueList: Array<SaleAttrValue>
    inputFlag?: boolean
    inputValue?: ''
    selectSaleAttrValueId?: number
}

export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}

export type HasSaleAttr = {
    id: number,
    name: string
}

export interface AllSaleAttrResponseData extends ResponseData {
    data: HasSaleAttr[]
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
        attrId: number
        valueId: number
    }>
    skuImageList?: Array<{
        id?: number
        imgName: string
        imgUrl: string
        isDefault?: string
        skuId?: number
        spuImgId?: number
    }>
    skuSaleAttrValueList?: Array<{
        saleAttrId: number
        saleAttrValueId: number
    }>
}

export interface SkuListResponse extends ResponseData {
    data: SkuData[]
}
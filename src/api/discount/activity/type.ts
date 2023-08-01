export type ResponseData = {
    code: number
    message: string
    ok: boolean
    data?: any
}

export type Activity = {
    id?: number
    createTime?: string
    updateTime?: string
    activityName: string
    activityType: string
    activityDesc: string
    startTime: string
    endTime: string
    activityTypeString?: string
}

export type ActivityPageData = {
    records: Array<Activity>
    total: number
    size: number
    current: number
    orders: Array<any>
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
}

export interface ActivityPageResponseData extends ResponseData {
    data: ActivityPageData
}

export type ActivityRule = {
    activityId?: number
    activityType?: string
    benefitAmount?: number
    benefitDiscount?: number
    benefitLevel?: number
    conditionAmount?: number
    conditionNum?: number
    id?: number
    reduceAmount?: number
    skuId?: number
    skuIdList?: Array<number>
}

export type ActivitySku = {
    activityId?: number
    id?: number
    skuId: number
}

export type ActivityRuleParams = {
    activityId?: number
    activityRuleList: Array<ActivityRule>
    activitySkuList: Array<ActivitySku>
    couponIdList: Array<number>
}

export type SkuInfo = {
    id: number
    spuId: number
    price: number
    skuName: string
    skuDesc: string
    weight: string
    tmId: number
    category3Id: number
    skuDefaultImg: string
    isSale: number
    createTime: string
    skuImageList: null
    skuAttrValueList: null
    skuSaleAttrValueList: null
}

export interface FindSkuResponseData extends ResponseData {
    data: SkuInfo[]
}

export interface FindActivityRuleListResponesData extends ResponseData{
    data: {
        couponInfoList: number[]
        activityRuleList: ActivityRule[]
        skuInfoList: SkuInfo[] | null
    }
}

export interface GetActivityResponesData extends ResponseData{
    data: Activity
}
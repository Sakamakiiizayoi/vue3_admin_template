export type ResponseData = {
    code: number
    message: string
    ok: boolean
    data?: any
}

export type Refund = {
    id: number
    createTime: string
    updateTime: null
    userId: number
    orderId: number
    skuId: number
    refundType: string
    refundNum: number
    refundAmount: number
    refundReasonType: string
    refundReasonTxt: string
    refundStatus: string
    approveOperatorId: number
    approveTime: string
    approveRemark: string
    recieveOperatorId: null
    recieveTime: null
    trackingNo: null
    trackingTime: null
    refundStatusString: string
    refundTypeString: string
    refundReasonTypeString: string
    outTradeNo: string
    skuName: string
    imgUrl: string
    orderPrice: string
}

export type RefundPageData = {
    records: Array<Refund>
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

export type RefundApprovalVo = {
    id?: number
    remark: string
    status: number
    userId?: number
}

export interface RefundPageResponseData extends ResponseData {
    data: RefundPageData
}
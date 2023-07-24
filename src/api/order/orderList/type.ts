export type ResponseData = {
    code: number
    message: string
    ok: boolean
    data?: any
}

export type OrderDetail = {
    id: number
    orderId: number
    skuId: number
    skuName: string
    imgUrl: string
    orderPrice: number
    skuNum: number
    createTime: string
    sourceType: string
    sourceId: number
    splitTotalAmount: number
    splitActivityAmount: number
    splitCouponAmount: number
    refundStatus: string
    refundStatusString: string
    hasStock: null
    activityRule: null
    couponInfoList: null
}

export type Order = {
    id: number
    consignee: string
    consigneeTel: string
    totalAmount: number
    orderStatus: string
    userId: number
    paymentWay: string
    deliveryAddress: string
    orderComment: string
    outTradeNo: string
    tradeBody: string
    createTime: string
    operateTime: null
    expireTime: string
    processStatus: string
    trackingNo: null
    parentOrderId: null
    imgUrl: null
    provinceId: null
    activityReduceAmount: null
    couponAmount: null
    originalTotalAmount: null
    feightFee: null
    feightFeeReduce: null
    refundableTime: null
    orderDetailList: Array<OrderDetail>
    orderDetailVoList: null
    orderStatusName: string
    wareId: null
    couponInfo: null
}

export type OrderData = {
    records: Array<Order>
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
}

export interface OrderPageResponseData extends ResponseData {
    data: OrderData
}
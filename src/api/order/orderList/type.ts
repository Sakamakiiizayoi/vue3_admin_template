export type ResponseData = {
    code: number
    message: string
    ok: boolean
    data?: any
}

export interface OrderDetailList {
    id: number;
    createTime: string;
    updateTime: string;
    orderId: number;
    skuId: number;
    skuName: string;
    imgUrl: string;
    orderPrice: number;
    skuNum: number;
    sourceType: string;
    sourceId: number;
    splitTotalAmount: number;
    splitActivityAmount: number;
    splitCouponAmount: number;
    wareId: number;
    refundStatus: string;
    refundStatusString: string;
    hasStock?: any;
    activityRule?: any;
    couponInfoList?: any;
}

export interface Order {
    id?: number;
    createTime?: string;
    updateTime?: string;
    consignee?: string;
    consigneeTel?: string;
    totalAmount?: number;
    orderStatus?: string;
    userId?: number;
    paymentWay?: string;
    deliveryAddress?: string;
    orderComment?: string;
    outTradeNo?: string;
    tradeBody?: string;
    operateTime?: string;
    expireTime?: string;
    processStatus?: string;
    trackingNo?: any;
    parentOrderId?: any;
    imgUrl?: any;
    provinceId?: number;
    activityReduceAmount?: number;
    couponAmount?: number;
    originalTotalAmount?: number;
    feightFee?: number;
    feightFeeReduce?: number;
    refundableTime?: string;
    orderDetailList?: OrderDetailList[];
    orderDetailVoList?: any;
    orderStatusName?: string;
    wareId?: any;
    couponInfo?: any;
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

export interface OrderDetailResponseData extends ResponseData {
    data: {
        time1: string;
        time4: string;
        orderInfo: Order;
        date4: string;
        date1: string;
    }
}
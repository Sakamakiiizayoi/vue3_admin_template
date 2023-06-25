export type TrademarkResponse = {
    code: number,
    message: string,
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        orders: [],
        optimizeCountSql: boolean,
        hitCount: boolean,
        countId: string,
        maxLimit: number,
        searchCount: boolean,
        pages: number
    },
    ok: boolean
}
export type Trademark = {
    id?: number,
    createTime?: string,
    updateTime?: string,
    tmName: string,
    logoUrl: string
}

export type Records = Trademark[]

export type responseData = {
    code: number,
    data: null,
    message: string,
    ok: boolean
}
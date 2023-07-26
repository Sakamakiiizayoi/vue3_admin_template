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

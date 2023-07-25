export type ResponseData = {
    code: number
    message: string
    ok: boolean
    data?: any
}

export type User = {
    id: number
    loginName: string
    nickName: string
    passwd: string
    name: string
    phoneNum: string
    email: null
    headImg: string
    userLevel: string
    status: number
    birthday: null
    gender: string
    createTime: string
    operateTime: string
    openId: null
}

export type UserPageData = {
    records: Array<User>
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
}

export interface UserPageResponseData extends ResponseData {
    data: UserPageData
}
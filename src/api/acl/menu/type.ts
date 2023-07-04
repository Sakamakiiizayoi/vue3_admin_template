export type ResponseData = {
    code: number
    message: string
    ok: boolean
    data?: any
}

export type Permission = {
    id: number
    createTime: string
    updateTime: string
    pid: number
    name: string
    code: string
    toCode: null
    type: number
    status: null
    level: number
    children: Permission[]
    select: boolean
}

export interface PermissionsResponseData extends ResponseData {
    data: Permission[]
}

export type MenuParams = {
    id?:number
    code: string
    level: number
    name: string
    pid: number
}
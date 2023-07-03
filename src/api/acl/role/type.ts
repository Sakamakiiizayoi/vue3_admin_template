export type ResponseData = {
    code: number
    message: string
    ok: boolean
    data?: any
}

export type Role = {
    createTime?: string
    id?: number
    remark?: string
    roleName: string
    updateTime?: string
}

export type GetRoleData = {
    records: Role[]
    total: number
    size: number
    current: number
    orders: any[]
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
}

export interface GetRoleResponseData extends ResponseData {
    data: GetRoleData
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

export interface GetRolePermissionsResponseData extends ResponseData {
    data: Permission[]
}

export type PermissionVo = {
    permissionIdList: number[]
    roleId: number
}
export type ResponseData = {
    code: number
    message: string
    ok: boolean
    data?: any
}

export type User = {
    id?: number
    createTime?: string
    updateTime?: string
    username: string
    password?: string
    name?: string
    phone?: string
    roleName?: string
}

export type UserData = {
    records: User[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
}

export interface UserResponseData extends ResponseData {
    data: UserData
}

export type Role = {
    id?: number
    createTime?: string
    updateTime?: string
    roleName: string
    remark?: string
}

export type RoleData = {
    assignRoles: Array<Role>
    allRolesList: Array<Role>
}

export interface AllRoleResponseData extends ResponseData {
    data: RoleData
}

export type SetRolesParams = {
    roleIdList: number[],
    userId: number
}
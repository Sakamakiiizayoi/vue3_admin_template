import request from '@/utils/request';
import type { ResponseData, User, UserResponseData, AllRoleResponseData, SetRolesParams } from './type';


enum API {
    GETUSER_URL = '/admin/acl/user/',
    ADDUSER_URL = '/admin/acl/user/save',
    UPDATEUSER_URL = '/admin/acl/user/update',
    ALLROLE_URL = '/admin/acl/user/toAssign/',
    DOASSIGNROLE_URL = '/admin/acl/user/doAssignRole',
    REMOVEUSER_URL = '/admin/acl/user/remove/',
    REMOVEUSERS_URL = '/admin/acl/user/batchRemove',
}

export const reqGetUser = (page: number, limit: number, username: string) => request.get<any, UserResponseData>(API.GETUSER_URL + `${page}/${limit}?username=${username}`)

export const reqAddOrUpdateUser = (data: User) => {
    if (data.id) {
        return request.put<any, ResponseData>(API.UPDATEUSER_URL, data)
    } else {
        return request.post<any, ResponseData>(API.ADDUSER_URL, data)
    }
}

export const reqAllRole = (userId: number) => request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userId)

export const reqDoAssignRole = (data: SetRolesParams) => request.post<any, ResponseData>(API.DOASSIGNROLE_URL, data)

export const reqRemoveUser = (userId: number) => request.delete<any, ResponseData>(API.REMOVEUSER_URL + userId)

export const reqRemoveUsers = (idList: number[]) => request.delete<any, ResponseData>(API.REMOVEUSERS_URL, { data: idList })
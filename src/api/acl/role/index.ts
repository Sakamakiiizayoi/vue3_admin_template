import request from '@/utils/request';
import type { ResponseData, GetRoleResponseData, Role, GetRolePermissionsResponseData, PermissionVo } from './type';

enum API {
    GETROLE_URL = '/admin/acl/role/',
    ADDROLE_URL = '/admin/acl/role/save',
    UPDATEROLE_URL = '/admin/acl/role/update',
    DELETEROLE_URL = '/admin/acl/role/remove/',
    ROLEPERMISSION_URL = '/admin/acl/permission/toAssign/',
    SETROLEPERMISSIONS_URL = '/admin/acl/permission/doAssignAcl',
}

export const reqGetRole = (page: number, limit: number, roleName: string) => request.get<any, GetRoleResponseData>(API.GETROLE_URL + `${page}/${limit}?roleName=${roleName}`)

export const reqAddOrUpdateRole = (data: Role) => {
    if (data.id) {
        return request.put<any, ResponseData>(API.UPDATEROLE_URL, data)
    } else {
        return request.post<any, ResponseData>(API.ADDROLE_URL, data)
    }
}

export const reqRemoveRole = (roleId: number) => request.delete<any, ResponseData>(API.DELETEROLE_URL + roleId)

export const reqGetRolePermissions = (roleId: number) => request.get<any, GetRolePermissionsResponseData>(API.ROLEPERMISSION_URL + roleId)

export const reqSetRolePermissions = (data: PermissionVo) => request.post<any, ResponseData>(API.SETROLEPERMISSIONS_URL, data)
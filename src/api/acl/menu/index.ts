import request from '@/utils/request';
import type { PermissionsResponseData, ResponseData, MenuParams } from './type';

enum API {
    GETPERMISSION_URL = '/admin/acl/permission',
    REMOVEPERMISSION_URL = '/admin/acl/permission/remove/',
    ADDPERMISSION_URL = '/admin/acl/permission/save',
    UPDATEPERMISSION_URL = '/admin/acl/permission/update',
}

export const reqGetPermission = () => request.get<any, PermissionsResponseData>(API.GETPERMISSION_URL)

export const reqRemovePermission = (id: number) => request.delete<any, ResponseData>(API.REMOVEPERMISSION_URL + id)

export const reqAddOrUpdatePer = (data: MenuParams) => {
    if(data.id){
        return request.put<any, ResponseData>(API.UPDATEPERMISSION_URL, data)
    }else{
        return request.post<any, ResponseData>(API.ADDPERMISSION_URL, data)
    }
}
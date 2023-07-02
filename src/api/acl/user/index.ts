import request from '@/utils/request';
import type { ResponseData, User, UserResponseData } from './type';


enum API {
    GETUSER_URL = '/admin/acl/user/',
    ADDUSER_URL = '/admin/acl/user/save',
    UPDATEUSER_URL = '/admin/acl/user/update',
}

export const reqGetUser = (page: number, limit: number) => request.get<any, UserResponseData>(API.GETUSER_URL + `${page}/${limit}`)

export const reqAddOrUpdateUser = (data: User) => {
    if (data.id) {
        return request.put<any, ResponseData>(API.UPDATEUSER_URL, data)
    } else {
        return request.post<any, ResponseData>(API.ADDUSER_URL, data)
    }
}
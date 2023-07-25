import request from '@/utils/request';
import type { ResponseData, UserPageResponseData } from './type';

enum API {
    USERPAGE_URL = '/admin/user/',
    LOCKUSER_URL = '/admin/user/lock/',
}

export const reqUserPage = (page: number, limit: number, keyword: string) => request.get<any, UserPageResponseData>(API.USERPAGE_URL + `${page}/${limit}?keyword=${keyword}`)

export const reqUserLock = (userId: number, status: number) => request.get<any, ResponseData>(API.LOCKUSER_URL + `${userId}/${status}`)

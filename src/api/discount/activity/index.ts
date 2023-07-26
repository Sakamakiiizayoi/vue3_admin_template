import request from '@/utils/request';
import type { ActivityPageResponseData, Activity, ResponseData } from './type';

enum API {
    BATCH_REMOVE_URL = '/admin/activity/activityInfo/batchRemove',
    FINDACTIVITY_URL = '/admin/activity/activityInfo/findActivityRuleList/{id}',
    FINDSKU_URL = '/admin/activity/activityInfo/findSkuInfoByKeyword/{keyword}',
    GET_URL = '/admin/activity/activityInfo/get/{id}',
    REMOVE_URL = '/admin/activity/activityInfo/remove/',
    SAVE_URL = '/admin/activity/activityInfo/save',
    SAVEACTIVITYRULE_URL = '/admin/activity/activityInfo/saveActivityRule',
    UPDATE_URL = '/admin/activity/activityInfo/update',
    ACTIVITY_PAGE_URL = '/admin/activity/activityInfo/',
}

/**
 * 获取活动分页
 * @param page 
 * @param limit 
 * @returns 
 */
export const reqActivityPage = (page: number, limit: number) => request.get<any, ActivityPageResponseData>(API.ACTIVITY_PAGE_URL + `${page}/${limit}`)

/**
 * 添加更新活动
 * @param params 
 * @returns 
 */
export const reqSaveOrUpdateActivity = (params: Activity) => {
    if (params.id) {
        return request.put<any, ResponseData>(API.UPDATE_URL, params)
    } else {
        return request.post<any, ResponseData>(API.SAVE_URL, params)
    }
}

/**
 * 通过id删除活动
 * @param id 
 * @returns 
 */
export const reqRemoveActivity = (id: number) => request.delete<any, ResponseData>(API.REMOVE_URL + id)


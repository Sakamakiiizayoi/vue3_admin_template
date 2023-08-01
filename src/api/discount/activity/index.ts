import request from '@/utils/request';
import type { ActivityPageResponseData, Activity, ResponseData, FindSkuResponseData, ActivityRuleParams, FindActivityRuleListResponesData, GetActivityResponesData } from './type';

enum API {
    BATCH_REMOVE_URL = '/admin/activity/activityInfo/batchRemove',
    FINDACTIVITY_URL = '/admin/activity/activityInfo/findActivityRuleList/',
    FINDSKU_URL = '/admin/activity/activityInfo/findSkuInfoByKeyword/',
    GET_URL = '/admin/activity/activityInfo/get/',
    REMOVE_URL = '/admin/activity/activityInfo/remove/',
    SAVE_URL = '/admin/activity/activityInfo/save',
    SAVEACTIVITYRULE_URL = '/admin/activity/activityInfo/saveActivityRule',
    UPDATE_URL = '/admin/activity/activityInfo/update',
    ACTIVITY_PAGE_URL = '/admin/activity/activityInfo/',
}

/**
 * 通过活动id获取活动
 * @param activityId 
 * @returns 
 */
export const reqGetActivity = (activityId: number) => request.get<any, GetActivityResponesData>(API.GET_URL + activityId)

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

/**
 * 批量删除活动
 * @param idList 
 * @returns 
 */
export const reqBatchRemoveActivity = (idList: string[]) => request.delete<any, ResponseData>(API.BATCH_REMOVE_URL, { data: idList })

/**
 * 通过关键字搜索商品
 * @param keyword 
 * @returns 
 */
export const reqFindSku = (keyword: string) => request.get<any, FindSkuResponseData>(API.FINDSKU_URL + keyword)

/**
 * 保存活动的活动规则
 * @param activityRuleParams 
 * @returns 
 */
export const reqSaveActivityRule = (activityRuleParams: ActivityRuleParams) => request.post<any, ResponseData>(API.SAVEACTIVITYRULE_URL, activityRuleParams)

/**
 * 通过活动id获取该活动规则
 * @param activityId 
 * @returns 
 */
export const reqFindActivityRule = (activityId: number) => request.get<any, FindActivityRuleListResponesData>(API.FINDACTIVITY_URL + activityId)
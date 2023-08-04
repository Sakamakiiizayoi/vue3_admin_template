import request from '@/utils/request';
import type { ResponseData, CouponPageResponseData, Coupon, CouponRule, GetCouponRuleResponseData } from './type';

enum API {
    BATCH_REMOVE_URL = '/admin/activity/couponInfo/batchRemove',
    FINDBYKEYWORD_URL = '/admin/activity/couponInfo/findCouponByKeyword/{keyword}',
    GETRULE_URL = '/admin/activity/couponInfo/findCouponRuleList/',
    GET_URL = '/admin/activity/couponInfo/get/{id}',
    REMOVE_URL = '/admin/activity/couponInfo/remove/',
    SAVE_URL = '/admin/activity/couponInfo/save',
    SAVERULE_URL = '/admin/activity/couponInfo/saveCouponRule',
    UPDATE_URL = '/admin/activity/couponInfo/update',
    COUPON_PAGE_REMOVE_URL = '/admin/activity/couponInfo/',
}

/**
 * 获取优惠券分页信息
 * @param page 
 * @param limit 
 * @returns 
 */
export const reqGetCouponPage = (page: number, limit: number) => request.get<any, CouponPageResponseData>(API.COUPON_PAGE_REMOVE_URL + `${page}/${limit}`)

/**
 * 更新或保存优惠券
 * @param couponParams 
 * @returns 
 */
export const reqSaveOrUpdateCoupon = (couponParams: Coupon) => {
    if (couponParams.id) {
        return request.put<any, ResponseData>(API.UPDATE_URL, couponParams)
    } else {
        return request.post<any, ResponseData>(API.SAVE_URL, couponParams)
    }
}

/**
 * 根据id删除相应优惠券
 * @param couponId 
 * @returns 
 */
export const reqRemoveCoupon = (couponId: number) => request.delete<any, ResponseData>(API.REMOVE_URL + couponId)

/**
 * 根据idList批量删除优惠券
 * @param idList 
 * @returns 
 */
export const reqBatchRemoveCoupon = (idList: string[]) => request.delete<any, ResponseData>(API.BATCH_REMOVE_URL, { data: idList })

/**
 * 保存优惠券规则
 * @param couponRule 
 * @returns 
 */
export const reqSaveCouponRule = (couponRule: CouponRule) => request.post<any, ResponseData>(API.SAVERULE_URL, couponRule)

/**
 * 根据优惠券id获得该优惠券的使用范围规则
 * @param couponId 
 * @returns 
 */
export const reqGetCouponRule = (couponId: number) => request.get<any, GetCouponRuleResponseData>(API.GETRULE_URL + couponId)
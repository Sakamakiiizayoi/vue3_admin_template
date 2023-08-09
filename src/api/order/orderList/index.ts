import request from '@/utils/request';
import type { OrderPageResponseData, ResponseData, OrderDetailResponseData } from './type';

enum API {
    ORDER_PAGE_URL = '/admin/order/',
    ORDER_SHOW_URL = '/admin/order/show/',
    ORDER_RECIEVE_URL = '/admin/order/recieve/',
}
/**
 * 获取订单分页列表
 * @param page 
 * @param limit 
 * @param consignee 
 * @returns 
 */
export const reqOrderPage = (page: number, limit: number, consignee: string) => request.get<any, OrderPageResponseData>(API.ORDER_PAGE_URL + `${page}/${limit}?consignee=${consignee}`)

/**
 * 签收订单
 * @param orderId 
 * @returns 
 */
export const reqOrderRecieve = (orderId: number) => request.get<any, ResponseData>(API.ORDER_RECIEVE_URL + `${orderId}`)

/**
 * show?
 * @param orderId 
 * @returns 
 */
export const reqOrderShow = (orderId: number) => request.get<any, OrderDetailResponseData>(API.ORDER_SHOW_URL + `${orderId}`)
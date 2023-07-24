import request from '@/utils/request';
import type { OrderPageResponseData, ResponseData } from './type';

enum API {
    ORDER_PAGE_URL = '/admin/order/',
    ORDER_SHOW_URL = '/admin/order/show/',
    ORDER_RECIEVE_URL = '/admin/order/recieve/',
}

export const reqOrderPage = (page: number, limit: number, consignee: string) => request.get<any, OrderPageResponseData>(API.ORDER_PAGE_URL + `${page}/${limit}?consignee=${consignee}`)

export const reqOrderRecieve = (orderId: number) => request.get<any, ResponseData>(API.ORDER_RECIEVE_URL + `${orderId}`)

export const reqOrderShow = (orderId: number) => request.get<any, ResponseData>(API.ORDER_SHOW_URL + `${orderId}`)
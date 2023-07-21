import request from '@/utils/request';
import type { OrderPageResponseData } from './type';

enum API {
    ORDER_PAGE_URL = '/admin/order/',
    ORDER_SHOW_URL = '/admin/order/show/{orderId}',
    ORDER_RECIEVE_URL = '/admin/order/recieve/{orderId}',
}

export const reqOrderPage = (page: number, limit: number, consignee: string) => request.get<any, OrderPageResponseData>(API.ORDER_PAGE_URL + `${page}/${limit}?consignee=${consignee}`)
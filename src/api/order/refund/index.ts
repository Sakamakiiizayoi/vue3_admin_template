import request from '@/utils/request';
import type { ResponseData, RefundPageResponseData, RefundApprovalVo } from './type';

enum API {
    ORDER_PAGE_URL = '/admin/order/orderRefundInfo/',
    ORDER_APPROVAL_URL = '/admin/order/orderRefundInfo/approval',
    ORDER_RECIEVE_URL = '/admin/order/orderRefundInfo/recieve/',
}

export const reqRefundPage = (page: number, limit: number) => request.get<any, RefundPageResponseData>(API.ORDER_PAGE_URL + `${page}/${limit}`)

export const reqRefundApproval = (data: RefundApprovalVo) => request.post<any, ResponseData>(API.ORDER_APPROVAL_URL, data)

export const reqRefundRecieve = (page: number) => request.get<any, ResponseData>(API.ORDER_RECIEVE_URL + `${page}`)
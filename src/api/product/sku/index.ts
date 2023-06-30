import request from '@/utils/request';
import type { ResponseData, SkuListResponse, GetSkuResponse } from './type';

enum API {
    SKU_URL = '/admin/product/list/',
    ONSALE_URL = '/admin/product/onSale/',
    CANCELSALE_URL = '/admin/product/cancelSale/',
    GETSKUBYID_URL = '/admin/product/getSkuInfo/',
    DELETESKU_URL = '/admin/product/deleteSku/',
}

export const reqSkuList = (page: number, limit: number) => request.get<any, SkuListResponse>(API.SKU_URL + `${page}/${limit}`)

export const reqSaleSku = (skuId: number) => request.get<any, ResponseData>(API.ONSALE_URL + `${skuId}`)

export const reqCancelSku = (skuId: number) => request.get<any, ResponseData>(API.CANCELSALE_URL + `${skuId}`)

export const reqGetSkuById = (skuId: number) => request.get<any, GetSkuResponse>(API.GETSKUBYID_URL + `${skuId}`)

export const reqDeleteSkuById = (skuId: number) => request.delete<any, ResponseData>(API.DELETESKU_URL + `${skuId}`)
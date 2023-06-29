import request from '@/utils/request';
import type { HasSpuResponseData, AllTradeMarkResponseDate, SpuImageListResponseData, SaleAttrResponseData, AllSaleAttrResponseData, SpuData, ResponseData } from './type';

enum API {
    HASSPU_URL = '/admin/product',
    ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    IMAGE_URL = '/admin/product/spuImageList/',
    SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
    ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    UPDATESPU_URL = '/admin/product/updateSpuInfo'
}

export const reqHasSpu = (page: number, limit: number, c3Id: number) => request.get<any, HasSpuResponseData>(`${API.HASSPU_URL}/${page}/${limit}?category3Id=${c3Id}`)

export const reqAllTradeMark = () => request.get<any, AllTradeMarkResponseDate>(API.ALLTRADEMARK_URL)

export const reqSpuImageList = (spuId: number) => request.get<any, SpuImageListResponseData>(API.IMAGE_URL + spuId)

export const reqSpuHasSaleAttr = (spuId: number) => request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

export const reqAllSaleAttr = () => request.get<any, AllSaleAttrResponseData>(API.ALLSALEATTR_URL)

export const reqAddOrUpdateSpu = (data: SpuData) => {
    if (data.id) {
        return request.post<any, ResponseData>(API.UPDATESPU_URL, data)
    } else {
        return request.post<any, ResponseData>(API.ADDSPU_URL, data)
    }
}
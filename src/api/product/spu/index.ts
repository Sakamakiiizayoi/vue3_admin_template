import request from '@/utils/request';
import type { HasSpuResponseData, AllTradeMarkResponseDate, SpuImageListResponseData, SaleAttrResponseData, AllSaleAttrResponseData, SpuData, ResponseData, SkuData, SkuListResponse,FindSpuByKeywordResponseData } from './type';

enum API {
    HASSPU_URL = '/admin/product',
    ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    IMAGE_URL = '/admin/product/spuImageList/',
    SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
    ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    UPDATESPU_URL = '/admin/product/updateSpuInfo',
    ADDSKU_URL = '/admin/product/saveSkuInfo',
    GETSKULIST_URL = '/admin/product/findBySpuId/',
    DELETESPU_URL = '/admin/product/deleteSpu/',
    FINDBYKEYWORD_URL = '/admin/product/findSpuInfoByKeyword/',
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

export const reqAddSku = (data: SkuData) => request.post<any, ResponseData>(API.ADDSKU_URL, data)

export const reqGetSkuList = (spuId: number) => request.get<any, SkuListResponse>(API.GETSKULIST_URL + spuId)

export const reqDeleteSpu = (spuId: number) => request.delete<any, ResponseData>(API.DELETESPU_URL + spuId)

export const reqFindSpuByKeyword = (keyword: string) => request.get<any, FindSpuByKeywordResponseData>(API.FINDBYKEYWORD_URL + keyword)
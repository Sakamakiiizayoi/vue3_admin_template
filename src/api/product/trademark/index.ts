import request from "@/utils/request";
import { TrademarkResponse, Trademark, ResponseData, FindTrademarkResponseData } from './type';

enum API {
    TRADEMARK_URL = '/admin/product/baseTrademark',
    ADD_TRADEMARK_URL = '/admin/product/baseTrademark/save',
    UPDATE_TRADEMARK_URL = '/admin/product/baseTrademark/update',
    DELETE_TRADEMARK_URL = '/admin/product/baseTrademark/remove/',
    FIND_TRADEMARK_URL = '/admin/product/baseTrademark/findBaseTrademarkByKeyword/',
}

/**
 * 获取品牌分页
 * @param page 
 * @param limit 
 * @returns 
 */
export const reqHasTrademark = (page: number, limit: number) => request.get<any, TrademarkResponse>(`${API.TRADEMARK_URL}/${page}/${limit}`)

/**
 * 更新添加品牌
 * @param data 
 * @returns 
 */
export const reqAddOrUpdateTrademark = (data: Trademark) => {
    if (data.id) {
        return request.put<any, ResponseData>(API.UPDATE_TRADEMARK_URL, data)
    } else {
        return request.post<any, ResponseData>(API.ADD_TRADEMARK_URL, data)
    }
}

/**
 * 删除品牌
 * @param id 
 * @returns 
 */
export const reqDeleteTrademark = (id: number) => request.delete<any, ResponseData>(API.DELETE_TRADEMARK_URL + id)

/**
 * 通过关键字查询品牌
 * @param keyword 
 * @returns 
 */
export const reqFindTrademarkByKeyword = (keyword: string) => request.get<any, FindTrademarkResponseData>(API.FIND_TRADEMARK_URL + keyword)


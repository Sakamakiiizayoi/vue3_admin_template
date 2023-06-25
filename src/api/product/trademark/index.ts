import request from "@/utils/request";
import { TrademarkResponse, Trademark, responseData } from './type';

enum API {
    TRADEMARK_URL = '/admin/product/baseTrademark',
    ADD_TRADEMARK_URL = '/admin/product/baseTrademark/save',
    UPDATE_TRADEMARK_URL = '/admin/product/baseTrademark/update',
    DELETE_TRADEMARK_URL = '/admin/product/baseTrademark/remove/',
}

export const reqHasTrademark = (page: number, limit: number) => request.get<any, TrademarkResponse>(`${API.TRADEMARK_URL}/${page}/${limit}`)

export const reqAddOrUpdateTrademark = (data: Trademark) => {
    if (data.id) {
        return request.put<any, responseData>(API.UPDATE_TRADEMARK_URL, data)
    } else {
        return request.post<any, responseData>(API.ADD_TRADEMARK_URL, data)
    }
}

export const reqDeleteTrademark = (id: number) => request.delete<any, responseData>(API.DELETE_TRADEMARK_URL + id)


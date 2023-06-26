import request from "@/utils/request";
import { C1Response, C2Response, C3Response, AttrResponse } from './type';

enum API {
    C1_URL = '/admin/product/getCategory1',
    C2_URL = '/admin/product/getCategory2/',
    C3_URL = '/admin/product/getCategory3/',
    ATTR_URL = '/admin/product/attrInfoList/',
}

export const reqC1 = () => request.get<any, C1Response>(API.C1_URL)
export const reqC2 = (c1id: number) => request.get<any, C2Response>(API.C2_URL + c1id)
export const reqC3 = (c2id: number) => request.get<any, C3Response>(API.C3_URL + c2id)
export const reqAttr = (c1id: number, c2id: number, c3id: number) => request.get<any, AttrResponse>(API.ATTR_URL + `${c1id}/${c2id}/${c3id}`)

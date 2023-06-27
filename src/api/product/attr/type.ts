export type C1Response = {
    code: number,
    data: {
        id: number,
        name: string
    }[],
    message: string,
    ok: boolean
}

export type C2Response = {
    code: number,
    data: {
        category1Id: number,
        id: number,
        name: string
    }[],
    message: string,
    ok: boolean
}

export type C3Response = {
    code: number,
    data: {
        category2Id: number,
        id: number,
        name: string
    }[],
    message: string,
    ok: boolean
}

export type CategoryState = {
    c1Arr: C1Response['data'],
    c1Id?: number,
    c2Arr: C2Response['data'],
    c2Id?: number,
    c3Arr: C3Response['data'],
    c3Id?: number
}

export type AttrValue = {
    id?: number
    valueName: string
    attrId?: number,
    flag?: boolean,
}

export type AttrData = {
    id?: number
    attrName: string
    categoryId?: number
    categoryLevel: number
    attrValueList: AttrValue[]
}

export type AttrResponse = {
    code: number
    message: string
    data: AttrData[]
    ok: boolean
}

export type ResponseData = {
    code: number,
    data: null,
    message: string,
    ok: boolean
}
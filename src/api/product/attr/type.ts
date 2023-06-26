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
    c1Id: number | undefined,
    c2Arr: C2Response['data'],
    c2Id: number | undefined,
    c3Arr: C3Response['data'],
    c3Id: number | undefined
}

export type AttrValueList = {
    id: number
    valueName: string
    attrId: number
}[]

export type AttrData = {
    id: number
    attrName: string
    categoryId: number
    categoryLevel: number
    attrValueList: AttrValueList
}

export type AttrResponse = {
    code: number
    message: string
    data: AttrData[]
    ok: boolean
}
export type loginForm = {
    username: string,
    password: string
}

export type loginResponseData = {
    code: number,
    data: string,
    message: string,
    ok: boolean
}

export type userInfoResponseData = {
    code: number,
    data: {
        routes: string[],
        buttons: string[],
        roles: string[],
        name: string,
        avatar: string
    },
    message: string,
    ok: boolean
}

export type logOutResponseData= {
    code: number,
    data: null,
    message: string,
    ok: boolean
}
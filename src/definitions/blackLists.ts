type BlackListGet = {
    blocked: string
    byUser: string
    id: number
    updatedAt: string
}

type BlackListSet = {
    blocked: string
    byUser: string
    id?: number
    updatedAt?: string
}

type BlackListUpdate = {
    blocked?: string
    byUser?: string
    id?: number
    updatedAt?: string
}

export {
    BlackListGet,
    BlackListSet,
    BlackListUpdate
}
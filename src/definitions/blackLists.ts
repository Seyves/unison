interface BlackListGet {
    blocked: string
    byUser: string
    id: number
    updatedAt: string
}

interface BlackListSet {
    blocked: string
    byUser: string
    id?: number
    updatedAt?: string
}

interface BlackListUpdate {
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
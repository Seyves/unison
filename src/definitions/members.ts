type MemberGet = {
    chatId: number
    id: number
    isPinned: boolean
    lastReadMessage: number | null
    userId: string
}

type MemberSet = {
    chatId: number
    id?: number
    isPinned?: boolean
    lastReadMessage?: number | null
    userId: string
}

type MemberUpdate = {
    chatId?: number
    id?: number
    isPinned?: boolean
    lastReadMessage?: number | null
    userId?: string
}

export {
    MemberGet,
    MemberSet,
    MemberUpdate
}
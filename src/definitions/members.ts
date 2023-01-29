interface MemberGet {
    chatId: number
    id: number
    isPinned: boolean
    lastReadMessage: number | null
    userId: string
}

interface MemberSet {
    chatId: number
    id?: number
    isPinned?: boolean
    lastReadMessage?: number | null
    userId: string
}

interface MemberUpdate {
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
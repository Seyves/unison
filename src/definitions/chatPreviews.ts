type ChatPreviewComponent = {
    id: number
    name: string
    isGroup: boolean
    lastMessage: {
        createdAt: string
        id: number
        sender: string
        text: string | null
        to: number
        updatedAt: string
        readBy: string[]
    }
    avatar: string
    unreadCount: number
}

type ChatPreviewGet = {
    id: number
    name: string
    isGroup: boolean
    lastMessage: {
        createdAt: string
        id: number
        sender: string
        text: string | null
        to: number
        updatedAt: string
        readBy: string[]
    }
    avatar: string
    unreadCount: number
}

export {
    ChatPreviewComponent,
    ChatPreviewGet
}



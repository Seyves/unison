import { MessageGet, MessagePending } from "./messages"

type ChatPreviewComponent = {
    id: number
    name: string
    isGroup: boolean
    lastMessage: MessageGet | MessagePending
    avatar: string
    unreadCount: number
}

type ChatPreviewGet = {
    id: number
    name: string
    isGroup: boolean
    lastMessage: MessageGet | MessagePending
    avatar: string
    unreadCount: number
}

export {
    ChatPreviewComponent,
    ChatPreviewGet
}



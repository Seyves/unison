type MessageComponent =  {
    createdAt: string
    id: number
    sender: string
    text?: string | null
    to: number
    updatedAt?: string
    status?: "error" | "pending" | "sended" | "read"
}

type MessagePending = {
    createdAt: string
    id: number
    sender: string
    text: string | null
    to: number
    updatedAt: string
    readBy: null
}

type MessageRealTimeGet = {
    createdAt: string
    id: number
    sender: string
    text: string | null
    to: number
    updatedAt: string
}

type MessageGet = {
    createdAt: string
    id: number
    sender: string
    text: string | null
    to: number
    updatedAt: string
    readBy: string[]
}

type MessageSet = {
    createdAt?: string
    id?: number
    sender: string
    text: string | null
    to: number
    updatedAt?: string
}
type MessageUpdate = {
    createdAt?: string
    id?: number
    sender: string
    text?: string | null
    to: number
    updatedAt?: string
}

export {
    MessageComponent,
    MessagePending,
    MessageRealTimeGet,
    MessageGet,
    MessageSet,
    MessageUpdate
}
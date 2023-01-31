type MessageComponent =  {
    createdAt: string
    id: number
    sender: string
    text?: string | null
    to: number
    updatedAt?: string
    status?: "error" | "pending" | "sended" | "read"
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
    MessageGet,
    MessageSet,
    MessageUpdate
}
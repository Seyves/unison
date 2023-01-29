interface MessageComponent {
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

interface MessageSet {
    createdAt: string
    id: number
    sender: string
    text: string | null
    to: number
    updatedAt: string
    readBy: null
}

interface MessageUpdate {
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
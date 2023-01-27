import { Database } from "./schema"

interface WarningObj {
    trigger: boolean,
    message: string | null
}

type messages = Database['public']['Tables']['messages']

type IMessage = messages & {
    [K in keyof messages]: {
        status?: "error" | "pending" | "sended" | "read"
    }
}

type IChatPreview = Database['public']['Functions']['get_chats_preview']['Returns']

type IMember = Database['public']['Tables']['members']

interface DirectionStatus {
    top: {
        isLoading: boolean,
        isReached: boolean
    },
    bottom: {
        isLoading: boolean,
        isReached: boolean
    }
}

export { 
    IMessage,
    IChatPreview,
    IMember, 
    DirectionStatus,
    WarningObj 
}
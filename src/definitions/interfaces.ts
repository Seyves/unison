interface WarningObj {
    trigger: boolean,
    message: string | null
}

interface IMessage extends IDraft{
    id: number,    
    createdAt: string,
    updatedAt: string
}

interface IDraft {
    sender: string,
    to: number,
    text: string | null
}

interface IChatPreview {
    id: string,
    name: string,
    isGroup: boolean,
    avatar: string,
    lastMessage?: IMessage,
    unreadCount: number
}

export { 
    IMessage, 
    IDraft,
    IChatPreview, 
    WarningObj 
}
import { MessageGet, MessagePending, MessageSet } from '../definitions/messages'
import { ChatPreviewGet } from '../definitions/chatPreviews'
import { create } from 'zustand'

interface StoreProperties {
    currentChat: number
    chats: {
        [id: number]: ChatProperties
    }
}

interface StoreAction {
    setPreview: (chatId: number, callback: (prev: ChatPreviewGet) => ChatPreviewGet) => void
    setMessages: (chatId: number, callback: (prev: MessageGet[]) => MessageGet[]) => void
    setPendingMessages: (chatId: number, callback: (prev: MessagePending[]) => MessagePending[]) => void
    readMessage: (chatId:number, messId: number | null, userId: string) => void
    setCurrentChat: (chatId: number) => void
    createPreviews: (previews: ChatPreviewGet[]) => void
}

interface ChatProperties {
    preview: ChatPreviewGet
    messages: MessageGet[]
    pendingMessages: MessagePending[]
}

interface ChatActions {
    setPreview: (callback: (prev: ChatPreviewGet) => ChatPreviewGet) => void
    setMessages: (callback: (prev: MessageGet[]) => MessageGet[]) => void
    setPendingMessages: (callback: (prev: MessagePending[]) => MessagePending[]) => void
    readMessage: (messId: number | null, userId: string) => void
}

type Store = StoreProperties & StoreAction
type ChatStore = ChatProperties & ChatActions

type Create = typeof create
interface UseChatStore {
    // Invoke signature.
    <T>(selectorCallback: (chat: ChatStore) => T, middleware: (Parameters<ReturnType<Create>>[1])) : T;
    // Property.
    getState: () => ChatStore;
}

export {
    ChatStore,
    StoreAction,
    Store,
    UseChatStore
}
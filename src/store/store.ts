import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { MessageGet, MessagePending, MessageSet } from '../definitions/messages'
import { ChatPreviewGet } from '../definitions/chatPreviews'
import { ChatStore, StoreAction, Store, UseChatStore } from './definitions'

const createDefaultLastMes = (chatId: number) => {
    const now = new Date().toISOString.toString()
    return {
        createdAt: now,
        id: 0,
        sender: 'nobody',
        text: null,
        to: chatId,
        updatedAt: now,
        readBy: null
    }
}

const createDefaultChat = (previewOrId: ChatPreviewGet | number) => ({
    preview: typeof previewOrId == 'number' ? {
        id: previewOrId,
        name: '...',
        isGroup: false,
        avatar: '...',
        unreadCount: 0,
        lastMessage: createDefaultLastMes(previewOrId)
    } : previewOrId, 
    messages: [], 
    pendingMessages: []
})

const getLastMessage = (messages: MessageGet[], pendingMessages: MessagePending[]) => {
    const mesLength = messages.length
    const pendMesLength = pendingMessages.length

    if (pendMesLength > 0) {
        return pendingMessages[pendMesLength-1]
    } else if (mesLength > 0) {
        return messages[mesLength-1]
    }
    return createDefaultLastMes(0)
}

const useStore = create(
    immer<Store & StoreAction>(set => ({
        currentChat: 0,
        chats: {},
        setMessages: (chatId, callback) => {
            set(state => {
                const pendingMessages = state.chats[chatId].pendingMessages
                const messages = callback(state.chats[chatId].messages)
                
                const lastMessage = getLastMessage(messages, pendingMessages)

                state.chats[chatId].messages = callback(state.chats[chatId].messages)
                state.chats[chatId].preview = {...state.chats[chatId].preview, lastMessage}
            })
        },
        setPendingMessages: (chatId, callback) => {
            set(state => {
                const messages = state.chats[chatId].messages
                const pendingMessages = callback(state.chats[chatId].pendingMessages)

                const lastMessage = getLastMessage(messages, pendingMessages)

                state.chats[chatId].pendingMessages = callback(state.chats[chatId].pendingMessages)
                state.chats[chatId].preview = {...state.chats[chatId].preview, lastMessage}
            })
        },
        setPreview: (chatId, callback) => {
            set(state => {
                state.chats[chatId].preview = callback(state.chats[chatId].preview)
            })
        },
        readMessage: (chatId, messId, userId) => {
            set(state => {
                const messages = state.chats[chatId].messages
                
                const newMessages = messages.map(mess => {
                    return (mess.id <= (messId || 0) && mess.sender != userId) ? 
                        {...mess, readBy: [...mess.readBy, userId]} : 
                        mess
                })
                state.chats[chatId].messages = newMessages

                const preview = state.chats[chatId].preview
                if (messId != newMessages[newMessages.length-1].id && userId == preview.lastMessage.sender) return

                state.chats[chatId].preview = {
                    ...preview, 
                    lastMessage: {
                        ...preview.lastMessage, 
                        readBy: preview.lastMessage.readBy ? 
                            [...preview.lastMessage.readBy, userId] : 
                            [userId]
                    }
                }
            })
        },
        createPreviews: (previews) => {            
            for (let preview of previews) {
                const chatId = preview.id

                set(state => {
                    chatId in state.chats ? 
                    state.chats[chatId].preview = preview : 
                    state.chats[chatId] = createDefaultChat(preview)
                })
            }
        },
        setCurrentChat: (chatId) => {
            set(state => {
                state.currentChat = chatId
            })
        }
    }))
)

const useChatStore = (chatId: number) => {    
    const state = useStore.getState()
    let chat = state.chats[chatId]
    //if chat isn't already in the store, creating one
    if (!chat) {
        chat = createDefaultChat(chatId)        
        useStore.setState(state => ({
            ...state, 
            chats: {...state.chats, [chatId]: chat}
        }))
    }
    const chatStore : UseChatStore = (selectorCallback, middleware) => useStore(state => selectorCallback({
        ...chat,
        setMessages: (callback) => state.setMessages(chatId, callback),
        setPendingMessages: (callback) => state.setPendingMessages(chatId, callback),
        setPreview: (callback) => state.setPreview(chatId, callback),
        readMessage: (messId, userId) => state.readMessage(chatId, messId, userId),
    }), middleware)

    chatStore["getState"] = () : ChatStore => ({
        ...chat,
        setMessages: (callback) => useStore.getState().setMessages(chatId, callback),
        setPendingMessages: (callback) => useStore.getState().setPendingMessages(chatId, callback),
        setPreview: (callback) => useStore.getState().setPreview(chatId, callback),
        readMessage: (messId, userId) => useStore.getState().readMessage(chatId, messId, userId),      
    })

    return chatStore
}

export default useChatStore
export { useStore }

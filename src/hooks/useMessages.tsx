import useChatStore from "../store/store"
import { MessageGet, MessagePending, MessageRealTimeGet } from "../definitions/messages"
import { useEffect, useState } from 'react'
import messagesAPI from "../api/messages"
import { shallow } from 'zustand/shallow'

const useMessages = (chatId: number, userId: string) => {
    const [isLoading, setIsLoading] = useState(true)

    const [ 
        messages,
        pendingMessages,
        setMessages, 
        setPendingMessages
    ] = useChatStore(chatId)(chat => [
        chat.messages,
        chat.pendingMessages,
        chat.setMessages,
        chat.setPendingMessages,
    ], shallow)
    
    const initialLoad = async () => {
        if (messages.length == 0) setIsLoading(true)
        const initMessages = await messagesAPI.getInit(chatId)
        if (initMessages) setMessages(prev => initMessages)
        setIsLoading(false)
    }
    
    useEffect(() => {
        initialLoad()
    }, [chatId])

    return { messages, pendingMessages,  setMessages, setPendingMessages, isLoading }
};

export default useMessages;
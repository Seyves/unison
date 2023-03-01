import useChatStore from "../store/store"
import { useEffect, useState } from 'react'
import chatsAPI from "../api/chats"
import { shallow } from 'zustand/shallow'

const useChatPreview = (chatId: number) => {
    const [isLoading, setIsLoading] = useState(true)

    const [ preview, setPreview ] = useChatStore(chatId)(chat => [
        chat.preview,
        chat.setPreview
    ], shallow)
    
    const fetch = async () => {
        if (!preview?.lastMessage) {
            const initPreview = await chatsAPI.getPreview(chatId)
            if (initPreview) setPreview(prev => initPreview)
        }
        setIsLoading(false)
    }
    
    useEffect(() => {
        fetch()
    }, [chatId])

    return { preview, setPreview, isLoading }
};

export default useChatPreview;
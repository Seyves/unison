import chatsAPI from "../api/chats";
import { useEffect, useState } from 'react'
import useChatStore, { useStore } from "../store/store";
import messagesAPI from "../api/messages";
import { MessageRealTimeGet } from "../definitions/messages";
import { MemberGet } from "../definitions/members";

const useChatPreviews = (userId: string) => {
    const [isLoading, setIsLoading] = useState(true)

    const [ chats, createPreviews ] = useStore(state => [
        state.chats, state.createPreviews
    ])

    const initialLoad = async () => {
        setIsLoading(true)
        const previews = await chatsAPI.getPreviews()
        if (previews) createPreviews(previews)
        setIsLoading(false) 
    }

    const handleNewMessage = async (message: MessageRealTimeGet) => {
        const previews = await chatsAPI.getPreviews()
        if (previews) createPreviews(previews)

        const currentChat = useStore.getState().currentChat
        if (message.sender == userId || message.to != currentChat) return
        useChatStore(currentChat).getState().setMessages(prev => {
            return [...prev, {...message, readBy: []}]
        })
    }

    const handleNewRead = async (member: MemberGet) => {
        if (member.userId == userId) return

        const readMessage = useChatStore(member.chatId).getState().readMessage

        readMessage(member.lastReadMessage, member.userId)
    }

    const subscribeToInserts = () => {
        return messagesAPI.subscribeMessages({
            event: "INSERT",
            callback: (resp) => handleNewMessage(resp.new)
        })
    }

    const subscribeToReads = () => {
        return messagesAPI.subscribeReads(
            (resp) => handleNewRead(resp.new)
        )
    }
    
    useEffect(() => {        
        initialLoad()
        const unsubscribeInserts = subscribeToInserts()
        const unsubscribeReads = subscribeToReads()

        return () => {
            unsubscribeInserts()
            unsubscribeReads()
        }
    }, [])    

    let previews = []

    for (let chatId in chats) {
        const chat = chats[chatId]
        previews.push(chat.preview)
    }
    
    previews.sort((a, b) => {
        const firstStamp = new Date(a.lastMessage.createdAt).valueOf()
        const secondStamp = new Date(b.lastMessage.createdAt).valueOf()
        return secondStamp - firstStamp
    })

    return { previews, isLoading }
}

export default useChatPreviews
import supabase from "../config/supabaseClient"
import { IMessage } from "../definitions/interfaces"

const sendMessage = async ({text, to, sender}: IMessage['Insert']) => {
    const resp = await supabase
        .from('messages')
        .insert({text, to, sender})
        .select('*')
    return resp.data?.[0]
}

const getInitMessages = async (chatId: number) => {
    const resp = await supabase
        .rpc('get_chat_messages', {chat: chatId} )
    
    return resp.data
}

const getMessages = async (chatId: number, from: number, up: boolean) => {
    const resp = await supabase
        .rpc('get_chat_messages', {chat: chatId, from, up})
    
    return resp.data
}

const getLastReadMessages = async (chatId: number) => {
    const resp = await supabase
        .rpc('get_chat_unread_ids', {chat: chatId})

    return resp.data
}

export {
    sendMessage,
    getInitMessages,
    getMessages,
    getLastReadMessages
}
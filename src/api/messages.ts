import supabase from "../config/supabaseClient"
import { MessageSet } from "../definitions/messages"

const sendMessage = async ({text, to, sender}: MessageSet) => {
    const resp = await supabase
        .from('messages')
        .insert({text, to, sender})
        .select('*')
    return resp.data?.[0]
}

const readMessage = async (chatId: number, userId: string, messId : number) => {
    const resp = await supabase
        .from('members')
        .update({lastReadMessage: messId})
        .match({
            userId,
            chatId
        })
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

export default {
    sendMessage,
    readMessage,
    getInitMessages,
    getMessages
}
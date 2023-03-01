import supabase from "../config/supabaseClient"
import { MessageSet, MessageRealTimeGet } from "../definitions/messages"
import { RealtimePostgresChangesPayload, RealtimePostgresUpdatePayload, REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js"
import { MemberGet } from "../definitions/members"

const send = async ({text, to, sender}: MessageSet) => {
    const resp = await supabase
        .from('messages')
        .insert({text, to, sender})
        .select('*')
    return resp.data?.[0]
}

const read = async (chatId: number, userId: string, messId : number) => {
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

const subscribeMessages = ({chatId, event, filter, callback} : {
    chatId?: number
    event: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT}`
    filter?: string
    callback: (resp?: RealtimePostgresChangesPayload<MessageRealTimeGet>) => void
}) => {
    const subscription = supabase
        .channel(chatId ? "all-chats-changes" : `chat-${chatId}-changes`)
        .on<MessageRealTimeGet>(
            'postgres_changes', 
            {
                event, 
                schema: 'public', 
                table: 'messages',
                filter,
            }, 
            resp => callback(resp)
        )
        .subscribe()

    return () => supabase.removeChannel(subscription)
}

const subscribeReads = (callback: (resp: RealtimePostgresUpdatePayload<MemberGet>) => void) => {
    const subscription = supabase
        .channel("read-changes")
        .on<MemberGet>(
            'postgres_changes', 
            {
                event: "UPDATE", 
                schema: 'public', 
                table: 'members',
            }, 
            resp => callback(resp)
        )
        .subscribe()

    return () => supabase.removeChannel(subscription)
}

const getInit = async (chatId: number) => {
    const resp = await supabase
        .rpc('get_chat_messages', {chat: chatId} )
    return resp.data
}

const get = async (chatId: number, from: number, up: boolean) => {
    const resp = await supabase
        .rpc('get_chat_messages', {chat: chatId, from, up})    
    return resp.data
}

export default {
    send,
    read,
    subscribeMessages,
    subscribeReads,
    getInit,
    get
}
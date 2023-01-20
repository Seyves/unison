import supabase from "../config/supabaseClient"
import { PostgrestResponse } from "@supabase/supabase-js";
import { IChatPreview, IDraft } from "../definitions/interfaces";

const getChatPreview = (chatId : string) => {
    return supabase
        .rpc('get_chats_preview')
        .eq('id', chatId) as unknown as Promise<PostgrestResponse<IChatPreview>>
}

const sendMessage = async (message: IDraft) => {
    const resp = await supabase
        .from('message')
        .insert(message)
}

export {
    getChatPreview,
    sendMessage
}
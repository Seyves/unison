import supabase from "../config/supabaseClient"
import { PostgrestResponse } from "@supabase/supabase-js";
import { IChatPreview } from "../definitions/utilities";

const getChatPreview = async (chatId : number) => {
    const resp = await supabase
        .rpc('get_chats_preview')
        .eq('id', chatId)
    
    return resp.data?.[0]
}

const getChatsPreview = async () => {
    const resp = await supabase
        .rpc('get_chats_preview')

    return resp.data
}

export default {
    getChatPreview,
    getChatsPreview
}
import supabase from "../config/supabaseClient"

const getPreview = async (chatId : number) => {
    const resp = await supabase
        .rpc('get_chats_preview')
        .eq('id', chatId)
    
    return resp.data?.[0]
}

const getPreviews = async () => {
    const resp = await supabase
        .rpc('get_chats_preview')

    return resp.data
}

export default {
    getPreview,
    getPreviews
}
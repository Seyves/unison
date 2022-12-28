import supabase from "../config/supabaseClient"

const getUsers = async (query : string) => {
    return await supabase
        .from('user')
        .select()
        .like('username', `%${query}%`)
}

export {getUsers}
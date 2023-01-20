import supabase from "../config/supabaseClient"

const getUsers = async (query : string) => {
    return await supabase
        .from('user')
        .select()
        .like('name', `%${query}%`)
}

export {getUsers}
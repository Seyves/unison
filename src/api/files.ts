import supabase from "../config/supabaseClient"

const getList = async (userId: string, bucketName: string) => {
    const resp = await supabase
        .storage
        .from(bucketName)
        .list(userId, {
            sortBy: { column: 'name', order: 'asc' },
        })
    return resp.data
}

const download = async (bucketName: string, path: string) => {
    const resp = await supabase
        .storage
        .from(bucketName)
        .download(path)
    return resp.data
}

const upload = async (bucketName: string, path: string, file: File) => {
    const resp = await supabase
        .storage
        .from(bucketName)
        .upload(path, file)
    return !!resp.data
}

const remove = async (bucketName: string, path: string) => {
    const resp = await supabase
        .storage
        .from(bucketName)
        .remove([path])
    return !!resp.data
}

const rename = async (bucketName: string, sourcePath: string, destPath: string) => {
    const resp = await supabase
        .storage
        .from(bucketName)
        .move(sourcePath, destPath)
    return !!resp.data
}

export default {
    getList,
    download,
    upload,
    remove,
    rename
}
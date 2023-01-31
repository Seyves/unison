type UserGet = {
    about: string | null
    avatar: string | null
    id: string
    login: string | null
    name: string | null
}

type UserSet = {
    about?: string | null
    avatar?: string | null
    id: string
    login?: string | null
    name?: string | null
}

type UserUpdate = {
    about?: string | null
    avatar?: string | null
    id?: string
    login?: string | null
    name?: string | null
}

export {
    UserGet,
    UserSet,
    UserUpdate
}
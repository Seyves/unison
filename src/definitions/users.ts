interface UserGet {
    about: string | null
    avatar: string | null
    id: string
    login: string | null
    name: string | null
}

interface UserSet {
    about?: string | null
    avatar?: string | null
    id: string
    login?: string | null
    name?: string | null
}

interface UserUpdate {
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
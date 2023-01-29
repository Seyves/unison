import { MessageGet, MessageSet, MessageUpdate } from "./messages"
import { UserGet, UserSet, UserUpdate } from "./users"
import { BlackListGet, BlackListSet, BlackListUpdate, } from "./blackLists"
import { MemberGet, MemberSet, MemberUpdate } from "./members"
import { ChatPreviewGet } from './chatPreviews'

export interface Database {
    public: {
        Tables: {
            black_list: {
                Row: BlackListGet
                Insert: BlackListSet
                Update: BlackListUpdate
            }
            chats: {
                Row: {
                    id: number
                    isGroup: boolean
                    theme: string | null
                }
                Insert: {
                    id?: number
                    isGroup?: boolean
                    theme?: string | null
                }
                Update: {
                    id?: number
                    isGroup?: boolean
                    theme?: string | null
                }
            }
            groups: {
                Row: {
                    avatar: string | null
                    id: number
                    name: string
                }
                Insert: {
                    avatar?: string | null
                    id?: number
                    name?: string
                }
                Update: {
                    avatar?: string | null
                    id?: number
                    name?: string
                }
            }
            members: {
                Row: MemberGet
                Insert: MemberSet
                Update: MemberUpdate
            }
            message_reactions: {
                Row: {
                    byUser: string
                    id: number
                    isDelited: boolean
                    isPinned: boolean
                    messageId: number
                    reaction: string | null
                }
                Insert: {
                    byUser: string
                    id?: number
                    isDelited?: boolean
                    isPinned?: boolean
                    messageId: number
                    reaction?: string | null
                }
                Update: {
                    byUser?: string
                    id?: number
                    isDelited?: boolean
                    isPinned?: boolean
                    messageId?: number
                    reaction?: string | null
                }
            }
            messages: {
                Row: MessageGet
                Insert: MessageSet
                Update: MessageUpdate
            }
            users: {
                Row: UserGet
                Insert: UserSet
                Update: UserUpdate
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_chat_messages:
                {
                    Args: { chat: number }
                    Returns: MessageGet
                } | {
                    Args: { chat: number; from: number; up: boolean }
                    Returns: MessageGet
                }
            get_chats_avatar: {
                Args: Record<PropertyKey, never>
                Returns: { id: number; avatar: string; name: string }
            }
            get_chats_preview: {
                Args: Record<PropertyKey, never>
                Returns: ChatPreviewGet
            }
            get_chats_unread: {
                Args: Record<PropertyKey, never>
                Returns: { id: number; unreadCount: number }
            }
            get_dialogs_avatar: {
                Args: Record<PropertyKey, never>
                Returns: { id: number; avatar: string; name: string }
            }
            get_groups_avatar: {
                Args: Record<PropertyKey, never>
                Returns: { id: number; avatar: string; name: string }
            }
            get_only_user_chats: {
                Args: Record<PropertyKey, never>
                Returns: number
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}

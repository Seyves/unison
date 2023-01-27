export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      black_list: {
        Row: {
          blocked: string
          byUser: string
          id: number
          updatedAt: string
        }
        Insert: {
          blocked: string
          byUser: string
          id?: number
          updatedAt?: string
        }
        Update: {
          blocked?: string
          byUser?: string
          id?: number
          updatedAt?: string
        }
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
        Row: {
          chatId: number
          id: number
          isPinned: boolean
          lastReadMessage: number | null
          userId: string
        }
        Insert: {
          chatId: number
          id?: number
          isPinned?: boolean
          lastReadMessage?: number | null
          userId: string
        }
        Update: {
          chatId?: number
          id?: number
          isPinned?: boolean
          lastReadMessage?: number | null
          userId?: string
        }
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
        Row: {
          createdAt: string
          id: number
          sender: string
          text: string | null
          to: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: number
          sender: string
          text?: string | null
          to: number
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: number
          sender?: string
          text?: string | null
          to?: number
          updatedAt?: string
        }
      }
      users: {
        Row: {
          about: string | null
          avatar: string | null
          id: string
          login: string | null
          name: string | null
        }
        Insert: {
          about?: string | null
          avatar?: string | null
          id: string
          login?: string | null
          name?: string | null
        }
        Update: {
          about?: string | null
          avatar?: string | null
          id?: string
          login?: string | null
          name?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_chat_messages:
        | {
            Args: { chat: number }
            Returns: {
              id: number
              sender: string
              to: number
              text: string
              createdat: string
              updatedat: string
            }[]
          }
        | {
            Args: { chat: number; from: number; up: boolean }
            Returns: {
              id: number
              sender: string
              to: number
              text: string
              createdat: string
              updatedat: string
            }[]
          }
      get_chat_unread_ids: {
        Args: { chat: number }
        Returns: Json
      }
      get_chats_avatar: {
        Args: Record<PropertyKey, never>
        Returns: { id: number; avatar: string; name: string }[]
      }
      get_chats_preview: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          name: string
          isGroup: boolean
          lastMessage: Json
          avatar: string
          unreadCount: number
        }[]
      }
      get_chats_unread: {
        Args: Record<PropertyKey, never>
        Returns: { id: number; unreadCount: number }[]
      }
      get_dialogs_avatar: {
        Args: Record<PropertyKey, never>
        Returns: { id: number; avatar: string; name: string }[]
      }
      get_groups_avatar: {
        Args: Record<PropertyKey, never>
        Returns: { id: number; avatar: string; name: string }[]
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

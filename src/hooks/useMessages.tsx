import { useQuery, useQueryClient } from '@tanstack/react-query';
import messagesAPI from '../api/messages';
import { MessageGet, MessageSet } from '../definitions/messages';
import { useEffect } from 'react'
import supabase from '../config/supabaseClient';

const useMessages = (chatId : number, userId: string) => {
    const queryClient = useQueryClient()

    const { data: messages } = useQuery({
        queryKey: ['chat', chatId],
        queryFn: () => messagesAPI.getInitMessages(chatId),
        refetchOnWindowFocus: false,
        staleTime: Infinity
    })

    const setMessages = (callback : (prev : MessageGet[]) => MessageGet[]) => {
        queryClient.setQueryData<MessageGet[]>(
            ['chat', chatId],
            prev => callback(prev || [])
        )
    }

    const pendingMessages = queryClient.getQueryData<MessageSet[]>(['chat-pending', chatId]) || []

    const setPendingMessages = (callback : (prev : MessageSet[]) => MessageSet[]) => {
        queryClient.setQueryData<MessageSet[]>(
            ['chat-pending', chatId],
            prev => callback(prev || [])
        )
    }

    if(messages) messages.getMyLastReadId = function () {
        return this?.reduce((lastReadMessage, message) => {
            return message.readBy.includes(userId) ? message.id : lastReadMessage
        }, 0)        
    }
    
    useEffect(()=> {
        const subscription = supabase
            .channel(`chat-${chatId}-changes`)
            .on<MessageGet>(
                'postgres_changes', 
                {
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'messages',
                    filter: `to=eq.${chatId}`,
                }, 
                resp => {
                    if (resp.new.sender == userId) return
                    setMessages(prev => [...prev, {...resp.new, readBy: []}])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])

    return { messages, setMessages, pendingMessages, setPendingMessages }
};

export default useMessages;
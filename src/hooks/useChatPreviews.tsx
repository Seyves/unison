import { useQuery, useQueryClient } from "@tanstack/react-query";
import chatsAPI from "../api/chats";
import { ChatPreviewGet } from "../definitions/chatPreviews";
import { useEffect } from 'react'
import supabase from '../config/supabaseClient';

const useChatPreviews = () => {
    const queryClient = useQueryClient()

    const { refetch, data: chatPreviews } = useQuery({
        queryKey: ['chat-previews'],
        queryFn: () => chatsAPI.getChatsPreview(),
        refetchOnWindowFocus: false,
        onSuccess: (previews) => {
            if (!previews) return;

            for (let preview of previews) {
                queryClient.setQueryData(
                    ["chat-preview", preview.id], 
                    preview
                )
            }
        }
    })

    //making chat-previews and chat-preview[chatId] reactive
    const setChatPreviews = (callback : (prev : ChatPreviewGet[]) => ChatPreviewGet[]) => {
        queryClient.setQueryData<ChatPreviewGet[]>(
            ['chat-previews'],
            prev => callback(prev || [])
        )
        ////...
    }    
    
    useEffect(() => {
        const subscription = supabase
            .channel("all-chat-changes")
            .on(
                'postgres_changes', 
                {
                    event: '*', 
                    schema: 'public', 
                    table: 'messages'
                }, 
                () => refetch()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    })    

    return { chatPreviews, refetch }
};

const useChatPreview = (chatId: number) => {
    const queryClient = useQueryClient()

    const { data: chatPreview } = useQuery({
        queryKey: ["chat-preview", chatId], 
        queryFn: () => chatsAPI.getChatPreview(chatId),
        refetchOnWindowFocus: false
    })

    //making chat-preview[chatId] and chat-previews reactive
    const setChatPreview = (callback : (prev : ChatPreviewGet) => ChatPreviewGet) => {
        queryClient.setQueryData<ChatPreviewGet>(
            ['chat-preview', chatId],
            prev => callback(prev as ChatPreviewGet)
        )

        queryClient.setQueryData<ChatPreviewGet[]>(
            ['chat-previews'],
            prev => {
                const thatOnePreview = prev?.find(item => item.id == chatId) as ChatPreviewGet
                const newPreview = callback(thatOnePreview)
                return prev?.map(preview => {
                    if (preview.id == newPreview.id) return newPreview
                    return preview
                })
            }
        )
    }  

    return { chatPreview, setChatPreview }
}

export default useChatPreviews
export { useChatPreview }
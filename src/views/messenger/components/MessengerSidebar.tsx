import ChatPreview from './ChatPreview';
import Input from '../../../components/Input';
import { useState, ChangeEvent, useEffect } from 'react';
import { getChatsPreview } from '../../../api/chats';
import createDebounce from '../../../functions/createDebounce'
import supabase from '../../../config/supabaseClient';
import { IChatPreview } from '../../../definitions/interfaces';
import { PostgrestResponse } from '@supabase/supabase-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const MessengerSidebar = () => {    
    const queryClient = useQueryClient()

    const { refetch, data: previews } = useQuery({
        queryKey: ['chat-previews'],
        queryFn: () => getChatsPreview(),
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

    supabase
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

    return (
        <div className="grid grid-rows-chat border-stone-700 border-r min-h-0">
            <div className="p-4 border-stone-700 border-b text-2xl font-bold flex items-end">Messages</div>            
            <div className='h-full grid grid-rows-[auto_1fr] min-h-0'>
                <div className='p-2'>
                    <Input 
                        className='w-full' 
                        placeholder='search...'
                        onChange={(e:ChangeEvent<HTMLInputElement>) => null}
                    />
                </div>
                <div className=" overflow-y-auto">
                    <div>
                        {previews?.map((item) => <ChatPreview key={item.id} {...item}/>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessengerSidebar;
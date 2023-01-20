import ChatPreview from './ChatPreview';
import Input from '../../../components/Input';
import { useState, ChangeEvent, useEffect } from 'react';
import { getUsers } from '../../../api/users';
import createDebounce from '../../../functions/debounce'
import supabase from '../../../config/supabaseClient';
import { IChatPreview } from '../../../definitions/interfaces';
import { PostgrestResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../main';

const debounce = createDebounce(100)

const MessengerSidebar = () => {    
    const { refetch, data: response } = useQuery({
        queryKey: ['chat-previews'],
        queryFn: () => supabase.rpc('get_chats_preview') as unknown as Promise<PostgrestResponse<IChatPreview>>,
        onSuccess: (response) => {
            response?.data?.forEach(preview => {
                queryClient.setQueryData(
                    ["chat-preview", preview.id.toString()], 
                    {...response, data: [preview]}
                )
            })
        }
    })    

    supabase
        .channel("all-chat-changes")
        .on(
            'postgres_changes', 
            {
                event: '*', 
                schema: 'public', 
                table: 'message'
            }, 
            () => refetch()
        )
        .subscribe() 

    const previews = response?.data 

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
                        {previews?.map((item: IChatPreview) => <ChatPreview key={item.id} {...item}/>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessengerSidebar;
import ChatPreview from './ChatPreview';
import Input from '../../../components/Input';
import { ChangeEvent } from 'react';
import supabase from '../../../config/supabaseClient';
import useChatPreviews from '../../../hooks/useChatPreviews';

const MessengerSidebar = () => {    
    const {chatPreviews, refetch} = useChatPreviews()

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
                        {chatPreviews?.map((item) => <ChatPreview key={item.id} {...item}/>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessengerSidebar;
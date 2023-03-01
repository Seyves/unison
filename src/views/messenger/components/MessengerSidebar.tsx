import ChatPreview from './ChatPreview';
import Input from '../../../components/Input';
import { ChangeEvent } from 'react';
import supabase from '../../../config/supabaseClient';
import useChatPreviews from '../../../hooks/useChatPreviews';
import Spinner from '../../../components/Spinner';
import { UserContext } from '../../Layout';
import { useContext } from 'react'

const MessengerSidebar = () => {    
    const user = useContext(UserContext)
    
    const { previews, isLoading } = useChatPreviews(user.id)

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
                        {!isLoading ? previews?.map((item) => <ChatPreview key={item.id} {...item}/>) : <div className='flex justify-center mt-10'><Spinner /></div> }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessengerSidebar;
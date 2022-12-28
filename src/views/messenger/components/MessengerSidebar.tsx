import ChatPreview from './ChatPreview'
import Input from '../../../components/Input';
import { useState, ChangeEvent, useEffect } from 'react';
import { getUsers } from '../../../api/users';
import createDebounce from '../../../functions/debounce'
import supabase from '../../../config/supabaseClient';

const debounce = createDebounce(100)

const MessengerSidebar = () => {
    const [data, setData] = useState<any>(null)
    
    useEffect(() => {
        
    }, [])

    function onInput(query: string) {
        debounce(() => search(query))
    }

    async function search(query: string) {
        const resp = await getUsers(query)
        setData(resp.data)
    }
    getchats()
    async function getchats() {
        const d = await supabase.from('chat').select()
        console.log(d)
    }

    return (
        <div className="grid grid-rows-chat border-stone-700 border-r">
            <div className="p-4 border-stone-700 border-b text-2xl font-bold flex items-end">Messages</div>
            
            <div>
                <div className='p-2'>
                    <Input 
                        className='w-full' 
                        placeholder='search...'
                        onChange={(e:ChangeEvent<HTMLInputElement>) => onInput(e.target.value)}
                    />
                </div>
                <div className="px-2 overflow-y-auto">
                    {data?.map((item) => <ChatPreview key={item.id} {...item}/>)}
                </div>
            </div>
        </div>
    );
}

export default MessengerSidebar;
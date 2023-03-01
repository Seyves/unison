import { useState, useContext, ChangeEvent } from 'react';
import { UserContext } from "../../../Layout";
import { MessagePending, MessageGet } from '../../../../definitions/messages';
import { CiLocationArrow1, CiLink, CiGrid42, CiFileOn } from "react-icons/ci";
import { TbFileImport, TbLayoutGridAdd } from "react-icons/tb";
import Input from '../../../../components/Input';
import Puzzle from '../../../../components/puzzle/Puzzle';
import { UseMutateFunction } from '@tanstack/react-query';

const Draft = ({chatId, sendMessage} : DraftComponent) => {
    const user = useContext(UserContext)
    const [ draft, setDraft] = useState({
        text: '',
    })

    const createPendingMessage = (template: typeof draft) : MessagePending => {
        return {
            id: Math.random(),
            sender: user.id,
            to: chatId,
            createdAt: (new Date()).toISOString(),
            updatedAt: (new Date()).toISOString(),
            readBy: null,
            ...template
        }
    }

    const onSend = () => {
        sendMessage(createPendingMessage(draft))
        setDraft((prev) => ({...prev, text: ''}))
    }

    return (
        <div>
            <div className='p-4'>
                <Puzzle/>
            </div>
            <div className="p-2 py-2 flex gap-1">
                <div className='group relative cursor-pointer'>
                    <div className='absolute bg-stone-900 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 z-10 -translate-y-full top-0 -left-1/2 text-sm border-[1px] border-stone-700 rounded-md text-stone-100 py-1 shadow-contex-menu shadow-stone-900'>
                        <div className='flex items-center px-2.5 py-2 hover:bg-stone-800 cursor-pointer gap-1'>
                            <TbLayoutGridAdd className='h-5 w-5' /> Puzzle
                        </div>
                        <div className='flex items-center px-2.5 py-2 hover:bg-stone-800 cursor-pointer gap-1'>
                            <TbFileImport className='h-5 w-5'/> File
                        </div>
                    </div>
                    <CiLink className='rotate-90 h-full w-8'/>
                </div>
                <Input 
                    placeholder="your message..."
                    className="w-full inline-block flex-grow-0 h-8" 
                    onChange={(e:ChangeEvent<HTMLInputElement>) => setDraft((prev) => ({...prev, text: e.target.value}))}
                    value={draft.text}
                    onKeyDown={(e) => {
                        if (e.key == "Enter") onSend()
                    }}
                />
                <div onClick={onSend} className="relative">
                    <CiLocationArrow1 className='cursor-pointer h-full w-8'/>
                </div>
            </div>
        </div>
        
    );
};

interface DraftComponent {
    chatId: number, 
    sendMessage: UseMutateFunction<MessageGet | undefined, unknown, MessagePending, void>
}

export default Draft;
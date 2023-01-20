import Person from "../../../components/Person";
import { useState, useContext, ChangeEvent } from 'react'
import { UserContext } from "../../Layout";
import { CiLocationArrow1 } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import Input from "../../../components/Input";
import Scroller from "./Scroller";
import { IChatPreview, IDraft } from "../../../definitions/interfaces";
import { getChatPreview, sendMessage } from "../../../api/chats";
import { queryClient } from "../../../main";
import { PostgrestResponse } from "@supabase/supabase-js";

const Chat = () => {
    const user = useContext(UserContext)
    const { chatId } = useParams() as { chatId: string }

    const [ draft, setDraft] = useState({
        text: '',
    })

    const { data: preview, error } = useQuery({
        queryKey: ["chat-preview", chatId], 
        queryFn: () => getChatPreview(chatId),
        select: (resp) => resp.data?.[0]
    })
    
    if (error) {
        return <div>Oops, something went wrong</div>
    }
    
    const send = () => {
        sendMessage({...draft, sender: user.id, to: parseInt(chatId)})
        setDraft((prev) => ({...prev, text: ''}))
    }

    return (
        <div className="grid grid-rows-chat min-h-0">
            <div className="p-2 border-b border-stone-700 flex items-center">
                {preview ? <Person name={preview.name} avatar={preview.avatar}/> : <Spinner/>}
            </div>    
            <Scroller chatId={chatId}/>
            <div className="p-2 py-2 flex gap-1">
                <Input 
                    placeholder="your message..."
                    className="w-full inline-block flex-grow-0 h-8" 
                    onChange={(e:ChangeEvent<HTMLInputElement>) => setDraft((prev) => ({...prev, text: e.target.value}))}
                    value={draft.text}
                    onKeyDown={(e) => {
                        if (e.key == "Enter") send()
                    }}
                />
                <div onClick={send}>
                    <CiLocationArrow1 
                        style={{height: '100%', width: '30px', cursor: 'pointer'}} 
                    />
                </div>
            </div>
        </div> 
    );
}

export default Chat

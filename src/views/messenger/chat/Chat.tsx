import Person from "../../../components/Person";
import { useState, useContext, ChangeEvent } from 'react'
import { UserContext } from "../../Layout";
import { CiLocationArrow1 } from "react-icons/ci";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import Input from "../../../components/Input";
import Scroller from "./components/Scroller";
import { getChatPreview } from "../../../api/chats";
import { sendMessage } from "../../../api/messages";
import useMessages from "../../../hooks/useMessages";
import { IMessage } from "../../../definitions/interfaces";

const Chat = () => {
    const user = useContext(UserContext)    
    const chatId = parseInt(useParams().chatId as string)

    const [ draft, setDraft] = useState({
        text: '',
    })

    const { setMessages, setPendingMessages } = useMessages(chatId)

    const { data: preview, error } = useQuery({
        queryKey: ["chat-preview", chatId], 
        queryFn: () => getChatPreview(chatId),
        refetchOnWindowFocus: false
    })

    const {mutate: send} = useMutation({
        mutationFn: async (pendingMessage: IMessage['Insert']) => await sendMessage(pendingMessage),
        onMutate: (pendingMessage) => {
            setPendingMessages(prev => [...prev, pendingMessage])
            setDraft((prev) => ({...prev, text: ''}))
        },
        onSuccess: (newMessage) => {
            if (!newMessage) return

            setPendingMessages(prev => {
                return prev.filter(pendingMessage => {
                    //make that more accurately later
                    return newMessage.text !== pendingMessage.text
                })
            })
            setMessages(prev => [...prev, newMessage])
        }
    })

    const createPendingMessage = (template: typeof draft) : IMessage['Insert'] => {
        return {
            sender: user.id,
            to: chatId,
            createdAt: (new Date()).toISOString(),
            ...template
        }
    }
    
    if (error) {
        return <div>Oops, something went wrong</div>
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
                        if (e.key == "Enter") send(createPendingMessage(draft))
                    }}
                />
                <div onClick={() => send(createPendingMessage(draft))}>
                    <CiLocationArrow1 
                        style={{height: '100%', width: '30px', cursor: 'pointer'}} 
                    />
                </div>
            </div>
        </div> 
    );
}

export default Chat

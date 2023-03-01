import Person from "../../../components/Person";
import { useContext, useEffect } from 'react'
import { UserContext } from "../../Layout";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import Scroller from "./components/Scroller";
import messagesAPI from "../../../api/messages";
import { DirectionStatus } from "../../../definitions/utilities";
import { MessagePending } from "../../../definitions/messages";
import useDirectionStatus from "../../../hooks/useDirectionStatus";
import getMyLastReadId from "../../../functions/getMyLastReadId";
import useMessages from "../../../hooks/useMessages";
import useChatPreview from "../../../hooks/useChatPreview";
import { useStore } from "../../../store/store";
import Draft from "./components/Draft";

const Chat = () => {
    const user = useContext(UserContext)    
    const chatId = parseInt(useParams().chatId as string)

    const [ directionStatus, setDirectionStatus ] = useDirectionStatus()

    const { messages, setMessages, pendingMessages, setPendingMessages, isLoading: isMessagesLoading } = useMessages(chatId, user.id)

    const { preview, setPreview, isLoading: isHeaderLoading } = useChatPreview(chatId)

    const { mutate: sendMessage } = useMutation({
        mutationFn: async (pendingMessage: MessagePending) => await messagesAPI.send(pendingMessage),
        onMutate: (pendingMessage) => {
            setPendingMessages(prev => [...prev, pendingMessage])
        },
        onSuccess: (newMessage) => {
            if (!newMessage) return
            setPendingMessages(prev => {
                return prev.filter(pendingMessage => {
                    //make that more accurately later
                    return newMessage.text !== pendingMessage.text
                })
            })
            setMessages(prev => [...prev, {...newMessage, readBy: []}])
        }
    })

    const { mutate: readMessage } = useMutation({
        mutationFn: async (messId: number) => messagesAPI.read(chatId, user.id, messId),
        onMutate: (newLastReadId) => {
            const prevLastReadId = getMyLastReadId(messages, user.id)     
            if (!prevLastReadId) return
            
            const readedDelta = messages?.filter(mess => {
                return mess.sender != user.id && mess.id > prevLastReadId && mess.id <= newLastReadId
            }).length
            if (!readedDelta || !preview) return
            
            const unreadCount = preview.unreadCount - readedDelta

            setPreview(prev => ({...prev, unreadCount}))
            setMessages(prev => {
                return prev.map((mess) => {
                    if (mess.id > prevLastReadId && mess.id <= newLastReadId) return {
                        ...mess, 
                        readBy: [...mess.readBy, user.id]
                    }
                    return mess
                }) 
            })
        },
    })

    useEffect(() => {
        useStore.getState().setCurrentChat(chatId)
    }, [chatId])

    const loadMessages = async (from: number, direction: keyof DirectionStatus) => {
        setDirectionStatus(direction, "isLoading", true)

        const newMessages = await messagesAPI.get(chatId, from, direction == 'top')
        
        setDirectionStatus(direction, "isLoading", false)

        if (!newMessages) return;
        if (newMessages.length < 49) setDirectionStatus(direction, "isReached", true)

        setMessages((prev) => {
            return direction == 'top' ?
                [...newMessages, ...prev] :
                [...prev, ...newMessages]
        })
    }

    return (
        <div className="grid grid-rows-chat min-h-0">
            <div className="p-2 border-b border-stone-700 flex items-center">
                {!isHeaderLoading ? <Person name={preview.name} avatar={preview.avatar}/> : <Spinner/>}
            </div>
            {!isMessagesLoading ? <Scroller
                chatId={chatId}
                messages={messages}
                pendingMessages={pendingMessages}
                directionStatus={directionStatus}
                readMessage={readMessage}
                loadMessages={loadMessages}
            /> : <div className="flex justify-center items-center"><Spinner/></div>}
            <Draft chatId={chatId} sendMessage={sendMessage}/>
        </div> 
    );
}

export default Chat

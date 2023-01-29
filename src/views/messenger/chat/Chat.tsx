import Person from "../../../components/Person";
import { useState, useContext, ChangeEvent, useEffect } from 'react'
import { UserContext } from "../../Layout";
import { CiLocationArrow1 } from "react-icons/ci";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import Input from "../../../components/Input";
import Scroller from "./components/Scroller";
import messagesAPI from "../../../api/messages";
import useMessages from "../../../hooks/useMessages";
import { DirectionStatus } from "../../../definitions/utilities";
import { MessageSet } from "../../../definitions/messages";
import { useChatPreview } from "../../../hooks/useChatPreviews";
import useDirectionStatus from "../../../hooks/useDirectionStatus";
import supabase from "../../../config/supabaseClient";
import { MemberGet } from "../../../definitions/members";

const Chat = () => {
    const user = useContext(UserContext)    
    const chatId = parseInt(useParams().chatId as string)

    const [ draft, setDraft] = useState({
        text: '',
    })

    const [ directionStatus, setDirectionStatus ] = useDirectionStatus()

    const { messages, setMessages, pendingMessages, setPendingMessages } = useMessages(chatId, user.id)

    const { chatPreview, setChatPreview } = useChatPreview(chatId)

    const { mutate: sendMessage } = useMutation({
        mutationFn: async (pendingMessage: MessageSet) => await messagesAPI.sendMessage(pendingMessage),
        onMutate: (pendingMessage) => {
            //creating pending message
            setPendingMessages(prev => [...prev, pendingMessage])
            //
            setChatPreview(prev => ({...prev, lastMessage: pendingMessage}))

            setDraft((prev) => ({...prev, text: ''}))
        },
        onSuccess: (newMessage) => {
            if (!newMessage) return
            
            //deleting pending message
            setPendingMessages(prev => {
                return prev.filter(pendingMessage => {
                    //make that more accurately later
                    return newMessage.text !== pendingMessage.text
                })
            })
            //creating real message
            setMessages(prev => [...prev, {...newMessage, readBy: []}])
        }
    })

    const { mutate: readMessage } = useMutation({
        mutationFn: async (messId: number) => messagesAPI.readMessage(chatId, user.id, messId),
        onMutate: (newLastReadId) => {
            const prevLastReadId = messages.getMyLastReadId()     
            if (!prevLastReadId) return
            
            const readedDelta = messages?.filter(mess => {
                return mess.sender != user.id && mess.id > prevLastReadId && mess.id <= newLastReadId
            }).length
            if (!readedDelta || !chatPreview) return
            
            const unreadCount = chatPreview.unreadCount - readedDelta

            setChatPreview(prev => ({...prev, unreadCount}))
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
        console.log(messages?.getMyLastReadId());
        
        const subscription = supabase
            .channel("read-changes")
            .on<MemberGet>(
                'postgres_changes', 
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'members'
                },
                resp => {
                    const memberUpdate = resp.new
                    if (memberUpdate.userId == user.id) return
                    setMessages(prev => {
                        return prev.map((mess) => {
                            if (mess.id <= (memberUpdate.lastReadMessage || 0) && mess.sender != memberUpdate.userId) return {
                                ...mess, 
                                readBy: [...mess.readBy, memberUpdate.userId]
                            }
                            return mess
                        }) 
                    })
                    if (memberUpdate.userId == chatPreview.lastMessage.sender) return
                    
                    setChatPreview(prev => ({
                        ...prev, 
                        lastMessage: {
                            ...prev.lastMessage, 
                            readBy: [...prev.lastMessage.readBy, memberUpdate.userId]
                        }
                    }))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [!!chatPreview, !!messages])    

    if (!messages) return <div></div>

    const loadMessages = async (from: number, direction: keyof DirectionStatus) => {
        setDirectionStatus(direction, "isLoading", true)

        const newMessages = await messagesAPI.getMessages(chatId, from, direction == 'top')
        
        setDirectionStatus(direction, "isLoading", false)

        if (!newMessages) return;
        if (newMessages.length < 49) setDirectionStatus(direction, "isReached", true)

        setMessages((prev) => {
            return direction == 'top' ?
                [...newMessages, ...prev] :
                [...prev, ...newMessages]
        })
    }

    const createPendingMessage = (template: typeof draft) : MessageSet => {
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

    return (
        <div className="grid grid-rows-chat min-h-0">
            <div className="p-2 border-b border-stone-700 flex items-center">
                {chatPreview ? <Person name={chatPreview.name} avatar={chatPreview.avatar}/> : <Spinner/>}
            </div>    
            <Scroller
                chatId={chatId}
                messages={messages}
                pendingMessages={pendingMessages}
                directionStatus={directionStatus}
                readMessage={readMessage}
                loadMessages={loadMessages}
            />
            <div className="p-2 py-2 flex gap-1">
                <Input 
                    placeholder="your message..."
                    className="w-full inline-block flex-grow-0 h-8" 
                    onChange={(e:ChangeEvent<HTMLInputElement>) => setDraft((prev) => ({...prev, text: e.target.value}))}
                    value={draft.text}
                    onKeyDown={(e) => {
                        if (e.key == "Enter") sendMessage(createPendingMessage(draft))
                    }}
                />
                <div onClick={() => sendMessage(createPendingMessage(draft))}>
                    <CiLocationArrow1 
                        style={{height: '100%', width: '30px', cursor: 'pointer'}} 
                    />
                </div>
            </div>
        </div> 
    );
}

export default Chat

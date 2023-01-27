import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../../Layout";
import { IMessage, DirectionStatus } from "../../../../definitions/interfaces";
import supabase from "../../../../config/supabaseClient";
import ScrollerView from "./ScrollerView";
import { getMessages } from "../../../../api/messages";
import useDirectionStatus from "../../../../hooks/useDirectionStatus";
import useMessages from "../../../../hooks/useMessages";
import useLastReads from "../../../../hooks/useLastReads";

const Scroller = ({chatId} : {chatId: number}) => {    
    const user = useContext(UserContext)

    const [directionStatus, setDirectionStatus] = useDirectionStatus()

    const { messages, pendingMessages, setPendingMessages, setMessages } = useMessages(chatId)

    const lastReadsIds = useLastReads(chatId)


    useEffect(()=> {
        const subscription = supabase
            .channel(`chat-${chatId}-changes`)
            .on<IMessage["Row"]>(
                'postgres_changes', 
                {
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'messages',
                    filter: `to=eq.${chatId}`,
                }, 
                resp => {
                    if (resp.new.sender == user.id) return
                    setMessages(prev => [...prev, resp.new])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription) 
            return
        }
    }, [])

    if (!messages || !lastReadsIds) return <div></div>

    
    const loadMessages = async (from: number, direction: keyof DirectionStatus) => {
        if (directionStatus[direction].isLoading || directionStatus[direction].isReached) return

        setDirectionStatus(direction, "isLoading", true)

        const newMessages = await getMessages(chatId, from, direction == 'top')
        
        setDirectionStatus(direction, "isLoading", false)

        if (!newMessages) return;
        if (newMessages.length < 20) setDirectionStatus(direction, "isReached", true)

        setMessages((prev) => {
            return direction == 'top' ?
                [...newMessages, ...prev] :
                [...prev, ...newMessages]
        })
    }

    return (
        <ScrollerView 
            messages={messages}
            pendingMessages={pendingMessages}
            lastReadsIds={lastReadsIds}
            loadMessages={loadMessages}
        />
    );
}

export default Scroller;
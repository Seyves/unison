import { useQuery } from "@tanstack/react-query";
import { useContext } from "react"
import { UserContext } from "../../Layout";
import Message from "./Message";
import { IChatPreview, IMessage } from "../../../definitions/interfaces";
import supabase from "../../../config/supabaseClient";
import { PostgrestResponse, RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { queryClient } from "../../../main";

const Scroller = ({chatId} : {chatId: string}) => {    
    const user = useContext(UserContext)

    let { data: messages, error} = useQuery({
        queryKey: ['chat', chatId],
        queryFn: () => supabase.rpc('get_chat_messages', {chat: chatId, from: 340, up: true}) as unknown as Promise<PostgrestResponse<IMessage>>,
        select: (resp) => {
            console.log(resp)
            return resp.data
        }
    })

    supabase
        .channel(`chat-${chatId}-changes`)
        .on<IMessage>(
            'postgres_changes', 
            {
                event: 'INSERT', 
                schema: 'public', 
                table: 'message',
                filter: `to=eq.${chatId}`,
            }, 
            resp => {
                queryClient.setQueryData<PostgrestResponse<IMessage>>(['chat', chatId], old => {
                    if (!old?.data) return old;
                    return {...old, data: [...old.data, resp.new]}
                })
            }
        )
        .subscribe()

    return (
        <div className="overflow-x-hidden overflow-y-auto flex flex-col-reverse p-3">
            <div className="flex flex-col gap-1">
                {messages?.map(item => <Message key={item.id} {...item}/>)}
            </div>
        </div>
    );
};

export default Scroller;
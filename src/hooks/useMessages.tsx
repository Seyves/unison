import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getInitMessages } from '../api/messages';
import { IMessage } from '../definitions/interfaces';

const useMessages = (chatId : number) => {
    const qc = useQueryClient()

    const { data: messages } = useQuery({
        queryKey: ['chat', chatId],
        queryFn: () => getInitMessages(chatId),
        refetchOnWindowFocus: false,
        staleTime: Infinity
    })

    const setMessages = (callback : (oldArray : IMessage["Row"][]) => IMessage["Row"][]) => {
        qc.setQueryData<IMessage["Row"][]>(
            ['chat', chatId],
            prev => prev ? callback(prev) : callback([])
        )
    }

    const pendingMessages = qc.getQueryData<IMessage["Insert"][]>(['chat-pending', chatId]) || []

    const setPendingMessages = (callback : (oldArray : IMessage["Insert"][]) => IMessage["Insert"][]) => {
        qc.setQueryData<IMessage["Insert"][]>(
            ['chat-pending', chatId],
            prev => prev ? callback(prev) : callback([])
        )
    }

    return { messages, setMessages, pendingMessages, setPendingMessages }
};

export default useMessages;
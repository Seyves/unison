import { getLastReadMessages } from "../api/messages";
import { useQuery } from "@tanstack/react-query";

const useLastReads = (chatId: number) => {
    let { data: lastReadsIds } = useQuery({
        queryKey: ['chat-last-reads', chatId],
        queryFn: () => getLastReadMessages(chatId),
        refetchOnWindowFocus: false,
        staleTime: Infinity
    })
    
    return lastReadsIds
};

export default useLastReads;
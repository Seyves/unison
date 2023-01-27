import { IMessage, DirectionStatus } from '../../../../definitions/interfaces';
import { useRef, useEffect, SyntheticEvent, useContext } from 'react';
import { UserContext } from "../../../Layout";
import Message from './Message';

const ScrollerView = ({messages, pendingMessages, lastReadsIds, loadMessages} : IScrollerView) => {
    const user = useContext(UserContext)

    const myLastReadElem = useRef<HTMLDivElement>(null)

    const myLastReadId = lastReadsIds[user.id].lastReadMessage

    let othersLastReadId = 0
    for (let id of lastReadsIds) {
        if (id > othersLastReadId) othersLastReadId = id
    }
    
    const scrollHandler = (e: SyntheticEvent) => {
        const scroller = e.target as HTMLDivElement
        const band = scroller.firstChild as HTMLDivElement
        const scrollerHeight = scroller.clientHeight
        const bandHeight = band.offsetHeight

        const spaceBottom = Math.abs(scroller.scrollTop)
        const spaceTop = bandHeight - spaceBottom - scrollerHeight

        //if near bottom
        if (spaceBottom - scrollerHeight/5 < 0) {
            loadMessages(messages[messages.length-1].id, 'bottom')
        }
        //if near top
        if (spaceTop - scrollerHeight/5 < 0) {
            loadMessages(messages[0].id, 'top')
        }
    }

    const setInitialScroll = () => {
        myLastReadElem.current?.scrollIntoView({block: "center"})
    }

    useEffect(setInitialScroll, [])

    const sortedMessages = messages?.map(message => {
        if (message.id == myLastReadId && messages?.[messages?.length-1].id != message?.id) {
            return <>
                <Message key={message.id} {...message} ref={myLastReadElem} status="read"/>
                <div className="text-center bg-stone-600 text-stone-200 text-sm -mx-3">New messages</div>
            </> 
        } else if (message.id > othersLastReadId){
            return <Message key={message.id} {...message} status="sended"/>
        } else {
            return <Message key={message.id} {...message} status="read"/>
        }
    })

    const sortedPendingMessages = pendingMessages?.map(message => {
        return <Message key={message.id} {...message} status="pending"/>
    })
    
    return (
        <div className="overflow-x-hidden overflow-y-auto flex flex-col-reverse px-3" onScroll={scrollHandler}>
            <div className="flex flex-col gap-1 pt-2">
                {sortedMessages}
                {sortedPendingMessages}
            </div>
        </div>
    );
};

interface IScrollerView {
    messages: IMessage["Row"][], 
    pendingMessages: IMessage["Insert"][]
    lastReadsIds: { 
        [key: string]: number | null
    },
    loadMessages: (from: number, direction: keyof DirectionStatus) => void
}

export default ScrollerView;
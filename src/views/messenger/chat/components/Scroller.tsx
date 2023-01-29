import { DirectionStatus } from '../../../../definitions/utilities';
import { MessageGet, MessageSet } from '../../../../definitions/messages';
import { useRef, useEffect, SyntheticEvent, useContext, useState } from 'react';
import { UserContext } from "../../../Layout";
import Message from './Message';
import createDebounce from '../../../../functions/createDebounce';

const debounce = createDebounce(150)

const Scroller = ({chatId, messages, pendingMessages, directionStatus, readMessage, loadMessages} : IScroller) => {
    const user = useContext(UserContext)
    const [isInitialScrolled, setIsInitialScrolled] = useState(false)

    const myLastReadElem = useRef<HTMLDivElement>(null)
    
    const myLastReadId = messages.getMyLastReadId()

    const setInitialScroll = () => {
        setIsInitialScrolled(false)         
        myLastReadElem.current?.scrollIntoView({block: "center"})
        setIsInitialScrolled(true)        
    }

    useEffect(setInitialScroll, [chatId])

    const scrollHandler = (e: SyntheticEvent) => {    
        if (!isInitialScrolled) return
        const scroller = e.target as HTMLDivElement
        const band = scroller.firstChild as HTMLDivElement
        const scrollerHeight = scroller.clientHeight
        const bandHeight = band.offsetHeight

        const spaceBottom = Math.abs(scroller.scrollTop)
        const spaceTop = bandHeight - spaceBottom - scrollerHeight        

        //if near bottom and bottom is't reached or loading
        if (
            spaceBottom - scrollerHeight < 0 &&
            !(directionStatus.bottom.isLoading || directionStatus.bottom.isReached)
        ) {
            loadMessages(messages[messages.length-1].id, 'bottom')
        }
        //if near top and top is't reached or loading
        if (
            spaceTop - scrollerHeight < 0 &&
            !(directionStatus.top.isLoading || directionStatus.top.isReached)
        ) {
            loadMessages(messages[0].id, 'top')
        }

        //logic for reading messages when scrolling
        const scrollerRect = scroller.getBoundingClientRect()   
        const scrollerCenter = scrollerRect.x + scrollerRect.width/2
        const scrollerBottom = scrollerRect.y + scrollerRect.height - 1

        const bottomMessElem = document.elementFromPoint(scrollerCenter, scrollerBottom)
        const bottomMessId = parseInt(bottomMessElem?.id || '')
        const bottomMess = messages.find(mess => mess.id == bottomMessId)

        if (!bottomMess) return

        if (myLastReadId < bottomMessId && bottomMess.sender != user.id) {
            debounce(() => readMessage(bottomMessId))
        }
    }

    const statusedMessages = messages?.map(message => {
        if (message.id == myLastReadId) {
            return <Message key={message.id} {...message} ref={myLastReadElem} status={message.readBy.length == 0 ? "sended" : "read"}/>
        }

        if (message.readBy.length == 0) {
            return <Message key={message.id} {...message} status={"sended"}/>
        } else {
            return <Message key={message.id} {...message} status={"read"}/>
        }
    })

    const statusedPendingMessages = pendingMessages?.map(message => {
        return <Message key={message.id} {...message} status="pending"/>
    })
    
    return (
        <div className="overflow-x-hidden overflow-y-auto flex flex-col-reverse" onScroll={scrollHandler}>
            <div className="flex flex-col pt-2">
                {statusedMessages}
                {statusedPendingMessages}
            </div>
        </div>
    );
};

interface IScroller {
    chatId: number
    messages: MessageGet[], 
    pendingMessages: MessageSet[],
    directionStatus: DirectionStatus,
    readMessage: (messId: number) => void,
    loadMessages: (from: number, direction: keyof DirectionStatus) => void
}

export default Scroller;
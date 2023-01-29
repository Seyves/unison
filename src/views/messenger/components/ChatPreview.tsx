import Person from "../../../components/Person"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../../Layout";
import { ChatPreviewComponent } from "../../../definitions/chatPreviews";
import getTimeFromISO from "../../../functions/getTImeFromISO";
import StatusIcon from "../chat/components/StatusIcon";

const ChatPreview = ({id, name, avatar, lastMessage, unreadCount} : ChatPreviewComponent) => {
    const user = useContext(UserContext)
    
    const lastMesTime = lastMessage && getTimeFromISO(lastMessage?.createdAt)
    const isFromMe = lastMessage.sender == user?.id

    let indicator
    if (isFromMe) {
        const messageStatus = lastMessage.readBy == null ? 'pending' : lastMessage.readBy.length == 0 ? 'sended' : 'read'
        indicator = <StatusIcon status={messageStatus}/>
    } else {
        const isHaveUnreads = !!unreadCount
        indicator = isHaveUnreads ? <p className="bg-fuchsia-700 rounded-full p-0.5 text-gray-100 flex justify-center text-xs min-w-7">{unreadCount}</p> : <div></div>
    }

    return (
        <Link to={"/messenger/" + id} className="flex h-16 p-2 cursor-pointer hover:bg-stone-700 transition ">
            <Person 
                name={name} 
                avatar={avatar} 
                placeholder={lastMessage && ((isFromMe ? 'You: ' : '') + lastMessage.text)}
            />
            <div className="flex flex-col justify-between py-1 flex-shrink-0 ml-2 items-stretch">
                <p className="text-xs">{lastMesTime && lastMesTime}</p>
                {indicator}
            </div>
        </Link>
    );
}

export default ChatPreview;
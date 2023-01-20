import Person from "../../../components/Person"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../../Layout";
import { IChatPreview } from "../../../definitions/interfaces";
import getTimeFromISO from "../../../functions/getTImeFromISO";

const ChatPreview = ({id, name, avatar, lastMessage, unreadCount} : IChatPreview) => {
    const user = useContext(UserContext)
    
    const lastMesTime = lastMessage && getTimeFromISO(lastMessage?.createdAt)

    return (
        <Link to={"/messenger/" + id} className="flex h-16 p-2 cursor-pointer hover:bg-stone-700 transition ">
            <Person 
                name={name} 
                avatar={avatar} 
                placeholder={lastMessage && ((lastMessage.sender == user?.id ? 'You: ' : '') + lastMessage.text)}
            />
            <div className="flex flex-col justify-between py-1 flex-shrink-0 ml-2 items-stretch">
                <p className="text-xs">{lastMesTime && lastMesTime}</p>
                {!!unreadCount && <p className="bg-fuchsia-700 rounded-full p-0.5 text-gray-100 flex justify-center text-xs min-w-7">{unreadCount}</p>}
            </div>
        </Link>
    );
}

export default ChatPreview;
import Person from "../../../components/Person"
import { Link } from "react-router-dom"

const ChatPreview = ({id, username, avatar, lastmes, lastmestime, unreadMes} : IChatPreview) => {
    return (
        <Link to={"/messenger/" + id} className="flex h-16 p-2 cursor-pointer hover:bg-stone-700 transition ">
            <Person username={username} avatar={avatar} placeholder={lastmes}/>
            <div className="flex flex-col justify-between py-1 flex-shrink-0 ml-2">
                <p className="text-xs">{lastmestime}</p>
                <p className="bg-fuchsia-700 self-end aspect-square rounded-full text-gray-100 flex justify-center text-xs">{unreadMes}</p>
            </div>
        </Link>
    );
}

interface IChatPreview {
    id: string,
    username: string,
    avatar?: string,
    lastmes?: string,
    lastmestime?: string,
    unreadMes?: number
}

export default ChatPreview;
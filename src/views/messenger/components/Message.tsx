import { useContext } from "react"
import { UserContext } from "../../Layout";
import { IMessage } from '../../../definitions/interfaces';
import getTimeFromISO from "../../../functions/getTImeFromISO";

const Message = ({id, sender, to, text, createdAt, updatedAt} : IMessage) => {    
    const user = useContext(UserContext)

    const lastMesTime = getTimeFromISO(createdAt)

    return (
        <div className="flex flex-col">
            <div className={'p-2 text-sm rounded-xl text-stone-100 flex gap-2 items-end ' 
                + (user.id == sender ? 'bg-fuchsia-700 self-end rounded-br-none' : 'bg-stone-700 self-start rounded-bl-none')}
            >
                <p>{text}</p>
                <p className="text-[10px] opacity-50 leading-3">{lastMesTime}</p>
            </div>
        </div>
    );
};

export default Message;
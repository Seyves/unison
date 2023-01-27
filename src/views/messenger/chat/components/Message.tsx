import { useContext, forwardRef, CSSProperties } from "react"
import { UserContext } from "../../../Layout";
import { IMessage } from '../../../../definitions/interfaces';
import getTimeFromISO from "../../../../functions/getTImeFromISO";
import StatusIcon from "./StatusIcon";


const Message = forwardRef<HTMLDivElement, IMessage["Insert"]>(({id, sender, to, text, createdAt, updatedAt, status = 'sended'}, ref) => {    
    const user = useContext(UserContext)

    const isFromMe = user.id == sender
    const lastMesTime = createdAt ? getTimeFromISO(createdAt): null
    
    return (
        <div className="flex flex-col" id={id ? id.toString() : undefined} ref={ref}>
            <div className={'p-2 text-sm rounded-xl text-stone-100 flex gap-3 items-end ' 
                + (isFromMe ? 'bg-fuchsia-700 self-end rounded-br-none' : 'bg-stone-700 self-start rounded-bl-none')}
            >
                <p>{text}</p>
                <div className="leading-3 flex relative gap-1">
                    <p className="text-[13px] opacity-60 self-end">{lastMesTime}</p>
                    {isFromMe && <StatusIcon status={status}/>}
                </div>
            </div>
        </div>
    );

});

export default Message;
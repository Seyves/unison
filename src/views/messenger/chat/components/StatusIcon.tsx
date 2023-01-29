import { CSSProperties } from "react"
import { SlMusicTone, SlMusicToneAlt } from "react-icons/sl";
import { MessageComponent } from "../../../../definitions/messages";

const basicIconStyles : CSSProperties = {
    height: '13px', 
    width: "13px", 
    strokeWidth: "40px",
    paintOrder: "stroke",
    strokeLinejoin: "round"
}

const statusesIcons = {
    error: <SlMusicTone style={{
        ...basicIconStyles,
        fill: "#f87171",
        stroke: "#f87171"        
    }}/>,
    pending: <SlMusicTone style={{
        ...basicIconStyles,
        opacity: '0.7',
        fill: "#f0abfc",
        stroke: "#f0abfc"
    }}/>,
    sended: <SlMusicToneAlt style={{
        ...basicIconStyles,
        opacity: '0.7',
        fill: "#f0abfc",
        stroke: "#f0abfc"
    }}/>,
    read: <SlMusicToneAlt style={{
        ...basicIconStyles,
        fill: "#f5d0fe",
        stroke: "#f5d0fe"
    }}/>    
}

const StatusIcon = ({status} : {status : MessageComponent["status"]}) => {
    return (
        <div>
            {status ? 
                statusesIcons[status] : 
                <SlMusicTone style={{
                    ...basicIconStyles,
                    opacity: 0     
                }}/>
            }
        </div>
    );
};

export default StatusIcon;
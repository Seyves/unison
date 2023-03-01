import { Dispatch, SetStateAction, PointerEvent } from 'react'
import { IoPauseSharp, IoPlaySharp } from "react-icons/io5"

const Timeline = ({isPlaying, setIsPlaying, rewind, progress} : TimelineComponent) => {
    const rewindHandler = (event: PointerEvent<HTMLDivElement>) => {
        const elemRect = event.currentTarget.getBoundingClientRect()
        const x = event.clientX

        const position = (x-elemRect.x)/elemRect.width * 100
        rewind(position)

        const moveHandler = (e: MouseEvent) => {
            const x = e.clientX
            const position = (x-elemRect.x)/elemRect.width * 100
            rewind(position)
        }

        document.addEventListener("mousemove", moveHandler)
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", moveHandler)
        })        
    }

    return (
        <div className="mt-1 flex items-center w-full -mb-1">
            {isPlaying ?
                <IoPauseSharp onClick={() => setIsPlaying(false)} className="cursor-pointer box-border h-[22px] w-[22px] relative right-0.5 p-0.5"/> : 
                <IoPlaySharp onClick={() => setIsPlaying(true)} className="cursor-pointer box-border h-[22px] w-[22px] p-0.5"/>
            }                    
            <div 
                onMouseDown={rewindHandler}
                className="bg-stone-700 h-4 border-t-[6px] border-b-[6px] border-stone-900 flex-1 flex cursor-pointer group-hover:border-stone-800"                 
            >
                <div className="h-full bg-stone-400" style={{width: `${progress}%`}}></div>
                <div className="bg-stone-400 h-full aspect-square rounded-full scale-[2]"></div>
            </div>
        </div>
    )
}

interface TimelineComponent {
    isPlaying: boolean,
    setIsPlaying: Dispatch<SetStateAction<boolean>>,
    rewind: (position: number) => void,
    progress: number
}

export default Timeline
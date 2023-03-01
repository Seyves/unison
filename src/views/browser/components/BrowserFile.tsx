import { UrlFile } from "../../../definitions/files" 
import { BsFillFileEarmarkMusicFill } from "react-icons/bs"
import { useRef, DragEvent, useEffect, useState, PointerEvent } from 'react'
import Timeline from "./Timeline";
import ContentEditable from "react-contenteditable";

const BrowserFile = ({file, isActive, isRenaming, rename, activate} : BrowserFileComponent) => {
    const audioElem = useRef<HTMLAudioElement>(null)
    const nameElem = useRef<HTMLInputElement>(null)
    const interval = useRef<ReturnType<typeof setInterval>|null>(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    //useRef instead of useState because ContentEditable does not work with it properly
    const name = useRef(file.name)
    
    const play = () => {
        if (!audioElem.current) return

        interval.current = setInterval(playingHandler, 10)
        audioElem.current.play()
    }

    const pause = () => {
        if (!audioElem.current) return

        if (interval.current) {
            clearInterval(interval.current)
            interval.current = null 
        }        
        audioElem.current.pause()
    }

    const rewind = (position: number) => {
        if (!audioElem.current || isNaN(audioElem.current.duration)) return 

        const duration = audioElem.current.duration
        audioElem.current.currentTime = position * duration / 100

        setProgress(position)
    }

    const playingHandler = () => {
        if (!audioElem.current) return

        const duration = audioElem.current.duration
        const current = audioElem.current.currentTime    
        setProgress(current / duration * 100)
    }

    const clickHandler = (event: PointerEvent<HTMLAnchorElement>) => {
        event.preventDefault()

        activate()
        rewind(0)
        setIsPlaying(true)
    }

    const onDragStart = (event: DragEvent) => {
        const ghostElem = document.getElementById(file.id);
        if (!ghostElem) return
        
        event.dataTransfer.setDragImage(ghostElem, 0, 0);
    }

    //It's terrible, i know...
    const setRenamingFocus = () => {
        if (!nameElem.current) return
        nameElem.current.focus()

        var range = document.createRange()
        var selection = window.getSelection() as Selection

        range.setStart(nameElem.current.firstChild as Node, name.current.length)
        range.collapse(true)        

        selection.removeAllRanges()
        selection.addRange(range)
    }

    useEffect(() => {
        if (isActive) return
        setIsPlaying(false)
        rewind(0)
    }, [isActive])

    useEffect(() => {
        if (isRenaming) setRenamingFocus()
    }, [isRenaming])

    useEffect(() => {
        isPlaying ? play() : pause()
    }, [isPlaying])

    return (
        <div className="w-full hover:bg-stone-800 p-1 box-border group">
            <a onClick={clickHandler} id={file.id} href={file.link} onDragStart={onDragStart} className="flex items-center gap-1 cursor-pointer">
                <BsFillFileEarmarkMusicFill className="h-full w-5 flex-shrink-0"/>
                <ContentEditable
                    onClickCapture={(e) => {
                        if (!isRenaming) return
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    html={name.current} 
                    disabled={!isRenaming}
                    innerRef={nameElem}
                    onKeyDown={(event) => {
                        if (event.key != "Enter") return        
                        rename(name.current)}
                    }        
                    onBlur={() => rename(name.current)}
                    onChange={(e) => {
                        name.current = e.target.value
                    }}
                    className={"text-stone-100 min-w-[4px] text-sm font-light text-ellipsis whitespace-nowrap overflow-hidden select-none focus:outline-0 " + (isRenaming ? "bg-stone-700" : "")}
                />
                <audio 
                    src={file.link} 
                    ref={audioElem} 
                    onEnded={() => setIsPlaying(false)}>
                </audio>
            </a>
            {isActive && <Timeline 
                isPlaying={isPlaying} 
                setIsPlaying={setIsPlaying} 
                rewind={rewind}
                progress={progress}
            />}
        </div>
    );
};

interface BrowserFileComponent {
    file: UrlFile, 
    isActive: boolean
    isRenaming: boolean
    rename: (newName: string) => void
    activate: () => void
}

export default BrowserFile
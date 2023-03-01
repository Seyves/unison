import { useContext, useEffect, useState, DragEvent, MouseEvent } from "react"
import filesAPI from "../../api/files";
import { UserContext } from "../Layout";
import Spinner from "../../components/Spinner";
import BrowserFile from "./components/BrowserFile";
import { UrlFile } from "../../definitions/files" 
import { Buffer } from 'buffer';
import ContextMenu from "./components/ContextMenu";
import * as midiManager from 'midi-file';

const Browser = () => {
    const user = useContext(UserContext)

    const [dragCounter, setDragCounter] = useState(0)
    const [contextMenu, setContexMenu] = useState({
        isOpened: false,
        target: "browser",
        x: 0,
        y: 0
    })
    
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [files, setFiles] = useState<UrlFile[]>([])

    const [active, setActive] = useState<string | null>(null)
    const [renaming, setRenaming] = useState<string | null>(null)
    
    const download = async() => {
        setIsLoading(true)

        const filesInfo = await filesAPI.getList(user.id, "users-sounds")
        if (!filesInfo) return setIsLoading(false)

        for (let fileInfo of filesInfo) {
            const file = await filesAPI.download("users-sounds", `${user.id}/${fileInfo.name}`)
            if (!file) continue

            setFiles(prev => [...prev, {
                id: fileInfo.id,
                name: fileInfo.name, 
                link: window.URL.createObjectURL(file)
            }])
        }

        setIsLoading(false) 

        const midiFile = await filesAPI.download("users-sounds", `${user.id}/${"untitled.mid"}`)
        if (!midiFile) return
        const buffer = await midiFile.arrayBuffer()
        const parsed = midiManager.parseMidi(Buffer.from(buffer))
        console.log(parsed)
    }

    const getSortedFiles = (files: UrlFile[]) => {
        return files.sort((a, b) => {
            return a.name < b.name ? 
                -1 : a.name > b.name ?
                1 : 0
        })
    }

    const upload = async(file: File) => {
        return filesAPI.upload("users-sounds", `${user.id}/${file.name}`, file)
    }

    const remove = async(fileName: string) => {
        const isSuccess = await filesAPI.remove("users-sounds", `${user.id}/${fileName}`)
        if (!isSuccess) return false

        setFiles(prev => prev.filter((file) => {
            return file.name != fileName
        }))
        return true
    }

    const rename = async(from: string, to: string) => {
        filesAPI.rename("users-sounds", `${user.id}/${from}`, `${user.id}/${to}`)
        setFiles(prev => getSortedFiles(prev.map((file) => {
            return from == file.name ? {...file, name: to} : file
        })))
    }

    const uploadAllFiles = async (files: FileList) => {
        setIsLoading(true)

        for (let file of files) {
            if (!file.type.includes("audio")) return
            const isSuccess = await upload(file)

            if (!isSuccess) continue

            setFiles(prev => getSortedFiles([...prev, {
                id: String(Math.random()),
                name: file.name, 
                link: window.URL.createObjectURL(file)
            }]))
        }

        setIsLoading(false)
    }

    const onDragEnter = (event: DragEvent) => {
        event.preventDefault()
        setDragCounter(prev => prev + 1)
    }

    const onDragOver = (event: DragEvent) => {
        event.preventDefault()
    }

    const onDragLeave = (event: DragEvent) => {
        event.preventDefault()
        setDragCounter(prev => prev - 1)
    }

    const onDrop = async (event: DragEvent) => {
        event.preventDefault()
        setDragCounter(0)

        const files = event.dataTransfer.files
        if (!files) return

        uploadAllFiles(files)
    }

    const contextMenuHandler = (event: MouseEvent) => {
        event.preventDefault()

        const targetElem = event.target as HTMLElement        
        const target = targetElem.closest('[id]')?.id || "browser"

        console.log(target)
        setContexMenu({
            isOpened: true,
            target,
            x: event.pageX,
            y: event.pageY
        })
    }

    const closeContextMenu = () => {
        setContexMenu(prev => ({...prev, isOpened: false}))
    }

    useEffect(() => { 
        download() 
    }, [])

    const draggedClasses = (dragCounter ? " border-2 bg-fuchsia-700/30" : '')

    const browserFiles = files.map(file => <BrowserFile 
        key={file.id}
        file={file}
        isActive={active == file.id}
        isRenaming={renaming == file.id}
        activate={() => setActive(file.id)}
        rename={(newName: string) => {
            rename(file.name, newName)
            setRenaming(null)
        }}
    />)
    
    return (
        <div className=" border-fuchsia-700/20 border-l-2 w-full h-full grid grid-rows-chat overflow-hidden min-w-[240px]">
            <div className="p-4 border-stone-700 border-b font-bold text-2xl flex items-end min-w-0">Browser</div>
            <div 
                onDragEnter={onDragEnter} 
                onDragLeave={onDragLeave} 
                onDragOver={onDragOver} 
                onDrop={onDrop}
                onContextMenu={contextMenuHandler}
                onClick={() => setContexMenu(prev => ({...prev, isOpened: false}))}
                className="relative w-full min-w-0"
                id="browser"
            >
                <div className={"pointer-events-none border-dashed h-full w-full absolute flex justify-center items-center" + draggedClasses}></div>
                <div className="py-1 w-full">
                    {browserFiles}
                    {isLoading && <Spinner/>}
                </div>
            </div>
            {contextMenu.isOpened && <ContextMenu 
                {...contextMenu}
                target={files.find(file => contextMenu.target == file.id) || "browser"}
                close={closeContextMenu}
                setRenaming={setRenaming}
                remove={remove}
            />}
        </div>
    );
};

export default Browser;
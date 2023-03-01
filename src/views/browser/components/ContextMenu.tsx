import { TbPencil, TbTrash, TbFolderPlus } from "react-icons/tb";
import { Dispatch, SetStateAction } from "react";
import { UrlFile } from "../../../definitions/files";

const actionClassNames = "px-2.5 py-2 hover:bg-stone-800 cursor-pointer flex items-center gap-1"

const ContextMenu = ({target, close, x, y, setRenaming, remove} : ContextMenuComponent) => {
    return (
        <div
            style={{
                left: `${x}px`,
                top: `${y}px`,
            }}
            className="absolute bg-stone-900 text-xs border-[1px] border-stone-700 rounded-md text-stone-100 py-1 shadow-contex-menu shadow-stone-900 " 
        >
            {target == "browser" ? 
                <div className={actionClassNames}>
                    <TbFolderPlus className="h-4 w-4"/> 
                    <p>Create folder</p>
                </div> :
                <>
                    <div className={actionClassNames} onClick={() => {
                        setRenaming(target.id)
                        close()
                    }}>
                        <TbPencil className="h-4 w-4"/> 
                        <p>Rename</p>
                    </div>
                    <div className={actionClassNames} onClick={() => {
                        remove(target.name)
                        close()
                    }}>
                        <TbTrash className="h-4 w-4"/> 
                        <p>Delete</p>
                    </div>
                </>
            }
        </div>
    );
};

interface ContextMenuComponent {
    close: () => void
    target: UrlFile | "browser",
    x: number,
    y: number
    setRenaming: Dispatch<SetStateAction<string | null>>
    remove: (fileName: string) => Promise<boolean>
}

export default ContextMenu;
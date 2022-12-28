const Person = ({username, avatar, placeholder} : Person) => {
    return (
        <div className="flex flex-grow h-full">
            <div className="aspect-square rounded-full overflow-hidden flex-shrink-0 mr-2">
                <img src={avatar} alt="avatar" className="w-full h-full"/>
            </div>
            <div className="flex-grow flex flex-col justify-between py-1 w-2">
                <p className=" font-bold">{username}</p>
                <p className="text-ellipsis whitespace-nowrap overflow-hidden text-xs">{placeholder}</p>
            </div>
        </div>
    )
}

interface Person {
    username: string,
    avatar?: string,
    placeholder?: string
}

export default Person;
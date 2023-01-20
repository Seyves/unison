const Input = (props : IInput) => {
    const classStr = `block bg-stone-800 placeholder:text-stone-500 outline-none p-2 rounded-md text-sm transition-all border border-stone-800 focus:border-stone-700 tracking-wide ${props.className}`

    if (props.label) {
        return (
            <div className="flex flex-col">
                <label htmlFor="label" className="mb-1 block text-stone-500 tracking-wider text-sm">{props.label}</label>
                <input {...props} className={classStr}/>
            </div>
        );
        
    } else {
        return <input {...props} className={classStr}/>
    }
};

interface IInput extends React.HTMLAttributes<HTMLInputElement> {
    value?: string
    label?: string
}

export default Input;
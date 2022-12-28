const Input = ({placeholder, type, label, className, value, onChange} : IInput) => {
    const classStr = `block bg-stone-800 placeholder:text-stone-500 outline-none p-2 rounded-md text-sm transition-all border border-stone-800 focus:border-stone-700 tracking-wide ${className}`

    if (label) {
        return (
            <div className="flex flex-col">
                <label htmlFor="label" className="mb-1 block text-stone-500 tracking-wider text-sm">{label}</label>
                <input placeholder={placeholder} id={label} type={type} className={classStr} value={value} onChange={onChange}/>
            </div>
        );
        
    } else {
        return <input placeholder={placeholder} type={type} className={classStr} value={value} onChange={onChange}/>
    }
};

interface IInput extends React.HTMLAttributes<HTMLInputElement> {
    value?: string;
    type?:string
    label?:string
}

export default Input;
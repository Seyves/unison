const Button = ({className, children, onClick} : IButton) => {
    return (
        <button 
            onClick={onClick}
            className={
                `bg-fuchsia-700 outline-none rounded-md p-2 text-lg hover:gradient hover:gradient 
                tracking-widest shadow-[0_0_0_0_rgba(217,70,239,1)] relative hover:bottom-1 bottom-0 transition-[bottom,box-shadow] hover:shadow-[0_4px_0_0px_rgba(112,26,117,1)] ${className}`
            }
        >
            {children}
        </button>
    );
};

interface IButton extends React.HTMLAttributes<HTMLButtonElement>{
}

export default Button;
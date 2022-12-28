import { NavLink, Route } from "react-router-dom";

const Tab = ({title, children, to} : ITab) => {
    return (
        <NavLink 
            to={to} 
            className={({isActive}) => {
                let classStr = "relative group p-1 rounded-md hover:bg-fuchsia-200 transform duration-300"
                classStr += isActive ? ' bg-fuchsia-300' : ''
                return classStr
            }}
        >
            {children}
            <div className="
                absolute top-1/2 -right-1/3 -translate-y-1/2 translate-x-full text-stone-50 text-xs 
                bg-stone-800 p-1 opacity-0 group-hover:opacity-100 transition-all font-medium pointer-events-none"
            >
                {title}
            </div>
        </NavLink>
    );
};

interface ITab{
    children?: React.ReactNode
    title: string;
    to: string;
}

export default Tab;
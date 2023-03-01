import Logo from "../components/Logo";
import { CiPaperplane, CiSliderVertical, CiLogout, CiSettings } from "react-icons/ci";
import { Outlet, redirect } from "react-router-dom";
import Tab from "../components/Tab";
import supabase from '../config/supabaseClient.js'
import { useNavigate, useLoaderData } from "react-router-dom";
import Button from "../components/Button";
import { createContext, useState } from "react";
import { User } from "@supabase/supabase-js";
import Browser from "./browser/Browser";

const stylesForIcons = "w-full h-full transition-all"

const UserContext = createContext<User>(null)

const Layout = () => {
    const navigate = useNavigate()
    const user = useLoaderData() as User

    const [sizes, setSizes] = useState<(number|string)[]>([
        '70%',
        'auto',
    ]);
    
    const signOut = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {

        } else {
            navigate("/auth")
        }
    }

    return (
        <UserContext.Provider value={user}>
            <div className="bg-stone-900 w-screen h-screen grid grid-cols-main grid-rows-main text-stone-300 overflow-hidden relative">
                <div className="p-2 col-span-3 flex items-center border-fuchsia-900/100 border-b-2">                
                    <Logo/>
                </div>
                <div className="p-2 flex flex-col gap-2 z-10 relative border-fuchsia-900/50 shadow-xl shadow-fuchsia-600/20">
                    <Tab title="Messenger" to="/messenger">
                        <CiPaperplane className={stylesForIcons}/>
                    </Tab>
                    <Tab title="Library" to="/library">
                        <CiSliderVertical className={stylesForIcons}/>
                    </Tab>
                    <Tab title="Settings" to="/settings">
                        <CiSettings className={stylesForIcons}/>
                    </Tab>
                    <Button onClick={signOut} className="mt-auto bg-fuchsia-900">
                        <CiLogout className={stylesForIcons}/>
                    </Button>
                </div>     
                <Outlet/>
                <Browser/>
            </div>
        </UserContext.Provider>
    );
};

const layoutLoader = async () => {
    const data = await supabase.auth.getSession()
    if (!data.data?.session) return redirect("/auth");
    return data.data.session.user
}

export { layoutLoader, UserContext }
export default Layout;
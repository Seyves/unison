import Logo from "../components/Logo";
import { CiPaperplane, CiSliderVertical, CiLogout } from "react-icons/ci";
import { Outlet, redirect } from "react-router-dom";
import Tab from "../components/Tab";
import supabase from '../config/supabaseClient.js'
import { useNavigate, useLoaderData } from "react-router-dom";
import Button from "../components/Button";
import { useContext, createContext } from "react";

const stylesForIcons = {
    width: '100%',
    height: '100%',
    'transition': 'all 0.5s ease'
}

const UserContext = createContext<string|null>(null)

const Layout = () => {
    const navigate = useNavigate()
    const user = useLoaderData() as string
    
    const signOut = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {

        } else {
            navigate("/auth")
        }
    }

    return (
        <UserContext.Provider value={user}>
            <div className="bg-stone-900 w-screen h-screen grid grid-cols-main grid-rows-main text-stone-300">
                <div className=" p-2 col-span-2 flex items-center border-fuchsia-900/100 border-b-2">                
                    <Logo/>
                </div>
                <div className="p-2 flex flex-col gap-2 z-10 relative border-fuchsia-900/50 shadow-xl shadow-fuchsia-600/20">
                    <Tab title="Messenger" to="/messenger">
                        <CiPaperplane style={stylesForIcons}/>
                    </Tab>
                    <Tab title="Library" to="/library">
                        <CiSliderVertical style={stylesForIcons}/>
                    </Tab>
                    <Button onClick={signOut} className="mt-auto bg-fuchsia-900">
                        <CiLogout style={stylesForIcons}/>
                    </Button>
                </div>
                <Outlet/>
            </div>
        </UserContext.Provider>
    );
};

const layoutLoader = async () => {
    const data = await supabase.auth.getSession()
    if (!data.data?.session) return redirect("/auth");
    return data.data.session.user
}

export { layoutLoader }
export default Layout;
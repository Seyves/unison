import supabase from '../../config/supabaseClient'
import Input from '../../components/Input.js';
import Button from '../../components/Button.js';
import { ChangeEvent, FormEvent, MouseEvent} from 'react'
import Spinner from '../../components/Spinner.js';
import { useState } from 'react'
import { useNavigate, redirect } from 'react-router-dom';
import useWarning from '../../hooks/useWarning.js';
import Warning from '../../components/Warning.js';

enum LoginType{
    SignIn = "Sign In",
    SignUp = "Sign Up",
    ForgetPassword = "Recover Password"
}

const Auth = () => {
    const [type, setType] = useState(LoginType.SignIn)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isSpinnerShown, setIsSpinnerShown] = useState(false)
    const [warning, setWarning] = useWarning()
    const navigate = useNavigate()
    
    const handleAuth = async (e: FormEvent) => {        
        e.preventDefault()

        if (email == '' || password == '') {
            return setWarning('Fill all fields')
        }

        setIsSpinnerShown(true)
        let data, error

        if (type == LoginType.SignIn) {
            ({ data, error } = await supabase.auth.signInWithPassword({email, password}))
        } else {
            ({ data, error } = await supabase.auth.signUp({email, password}))
        }     
        if (error) {
            if (error.message.includes("Invalid login")) setWarning('Wrong login or password')
            else setWarning('Oops, something went wrong')

            setIsSpinnerShown(false)
            return
        }

        navigate('/')
    }

    const changeLoginType = (e: MouseEvent, type: LoginType) => {
        e.preventDefault()
        setType(type)
    }

    const footerElemClassStr = "text-center text-sm text-stone-500 underline block"

    return (
        <div className="bg-stone-900 w-screen h-screen flex justify-center items-center text-stone-300">
            <div className='relative'>
                <div className='text-center logo gradient text-8xl mb-8 select-none'>
                    UNISON<span className="text-6xl">♪</span>
                </div>
                <div className='px-8 py-6 shadow-[0_35px_800px_-15px_rgba(162,28,175,0.5)] rounded-xl w-4/5 mx-auto'>
                    <form action="" className='flex gap-4 flex-col' onSubmit={(e) => handleAuth(e)}>
                        <Input 
                            placeholder="your email..."
                            type="text" 
                            label="Email" 
                            value={email} 
                            onChange={(e:ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                        <Input 
                            placeholder="your password..." 
                            type="password" label="Password" 
                            value={password} 
                            onChange={(e:ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                        <Button className="mt-2 z-10">{type}</Button>
                    </form>
                    {isSpinnerShown && <Spinner className='mt-4 mx-auto'></Spinner>}
                    <div className='mt-4'>
                        <a
                            href='' 
                            className={footerElemClassStr} 
                            onClick={(e) => changeLoginType(e, type == LoginType.SignIn ? LoginType.SignUp : LoginType.SignIn)}                            
                        >{type == LoginType.SignIn ? "Don't have an account?" : "Alredy have an account?"}</a>                        
                    </div>
                </div>
                
                <Warning className='absolute -bottom-8 w-full' warning={warning}/>
            </div>
        </div>
    );
};

const authLoader = async () => {
    const data = await supabase.auth.getSession()
    if (data.data?.session) return redirect("/");
    return data.data
}

export { authLoader }
export default Auth;
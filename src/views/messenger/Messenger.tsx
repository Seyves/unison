import { Outlet, Route, Routes } from 'react-router-dom';
import MessengerSidebar from './components/MessengerSidebar';

const Messenger = () => {
    return (
        <div className="grid grid-cols-messenger min-h-0">
            <MessengerSidebar />
            <Outlet/>
        </div>
    );
}

export default Messenger;

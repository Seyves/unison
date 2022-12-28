import Layout from "./Layout";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Messenger from './messenger/Messenger'
import Library from './library/Library'
import Chat from './messenger/components/Chat'
import Auth from "./auth/Auth";
import { layoutLoader } from "./Layout";
import { authLoader } from "./auth/Auth";

const router = createBrowserRouter([{
    path: '/',
    element: <Layout/>,
    loader: layoutLoader,
    children: [{
        path: 'messenger',
        element: <Messenger/>,
        children: [{
            path: ':uuid',
            element: <Chat/>,
        }]
    }, {
        path: 'library',
        element: <Library/>,
    }]
},
{
    path: '/auth',
    element: <Auth/>,
    loader: authLoader
}
])

const App = () => {
    return (
        <RouterProvider router={router}/>
    );
}

export default App
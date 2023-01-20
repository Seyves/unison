import ReactDOM from 'react-dom/client'
import App from './views/App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  //<React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <App/>
    </QueryClientProvider>
  //</React.StrictMode>,
)

export {
    queryClient
}

// {
//     path: '/',
//     element: <App />,
//     children: [
//         {
//             path: "messenger/:uuid",
//             element: <Chat />,
//             loader: chatLoader
//         },
//     ],   
// }

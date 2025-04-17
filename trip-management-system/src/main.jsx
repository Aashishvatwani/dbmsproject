import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import App from './App.jsx'

import SignUpPage from './components/Signup.jsx'
import LoginPage from './components/Login.jsx'
import FrontPage from './components/Frontpage.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <FrontPage />,
        },
        {
            path: "/login",
            element: (
                
                    <LoginPage />
               
            ),
        },
        {
            path: "/signup",
            element: (
                
                    <SignUpPage />
                
            ),
        },
      ],
    },
  ])
createRoot(document.getElementById('root')).render(
  <StrictMode>
  
    <RouterProvider router={router}/>
  
  </StrictMode>,
)

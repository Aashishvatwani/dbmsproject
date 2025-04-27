import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import App from './App.jsx'

import SignUpPage from './components/Signup.jsx'
import LoginPage from './components/Login.jsx'
import FrontPage from './components/Frontpage.jsx'
import FrontPage_after from './components/Frontend_after.jsx'
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
        {
          path: "/home",
          element: (
              
                  <FrontPage_after />
             
          ),
        }
      ],
    },
  ])
createRoot(document.getElementById('root')).render(
  <StrictMode>
  
    <RouterProvider router={router}/>
  
  </StrictMode>,
)

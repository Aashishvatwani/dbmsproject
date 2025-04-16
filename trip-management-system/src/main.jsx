import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import store from './store/store.js'
import Protected from './components/Authlayout.jsx'
import { Provider } from 'react-redux'
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
                <Protected authentication={false}>
                    <LoginPage />
                </Protected>
            ),
        },
        {
            path: "/signup",
            element: (
                <Protected authentication={false}>
                    <SignUpPage />
                </Protected>
            ),
        },
      ],
    },
  ])
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
  </StrictMode>,
)

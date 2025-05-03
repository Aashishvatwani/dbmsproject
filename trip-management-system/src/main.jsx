import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import SignUpPage from './components/Signup.jsx';
import LoginPage from './components/Login.jsx';
import FrontPage from './components/Frontpage.jsx';
import FrontPage_after from './components/Frontend_after.jsx';
import CityDetail from './components/CityDetails.jsx';
import { AuthProvider } from './components/AuthProvider.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';  // Import ProtectedRoute
import HotelCard from './components/HotelCard.jsx';
import BookingPage from './components/Mediam&date.jsx';
import ForgotPassword from './components/Forgot-password.jsx';
import TravelDetails from './components/HotelCard.jsx';
import HotelInfoForm from './components/Generate_package.jsx';

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
        path: "/forgot-password",
        element: <ForgotPassword/>,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <FrontPage_after />
          </ProtectedRoute>
        ),
      },
      {
        path: "/home/:cityName",
        element: (
          <ProtectedRoute>
            <CityDetail />
          </ProtectedRoute>
        ),
      },
      
      {
        path:"home/:cityName/:cityName/:hotelName/bookings",
        element: (
          <ProtectedRoute>
            < BookingPage/>
          </ProtectedRoute>
        ),
      },
      {
        path:"/card",

        element:(
          <ProtectedRoute>
             <TravelDetails/>
          </ProtectedRoute>
        ),
       
      },
      {
        path:"/addhotel",

        element:(
          <ProtectedRoute>
             <HotelInfoForm/>
          </ProtectedRoute>
        ),
       
      },

    ],
   
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);

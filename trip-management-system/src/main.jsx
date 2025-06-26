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
import TripDashboard from './components2/Trip-Dashboard.jsx';
import TeamRegistration from './components2/Team-registration.jsx';
import ExpenseUpload from './components2/ExpenseUpload.jsx';
import DocumentUploadPage from './components2/DocumentUploadPage.jsx';
import UserProfilePage from './components2/UserProfilePage.jsx';
import TeammateDocumentViewer from './components2/Documentviewer.jsx';
import TeamChatPage from './components2/ChatRoom.jsx';
import TeamConfirmationPage from './components2/Confirmationforteam.jsx';

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
        path: "/Documentview",
        element: (<ProtectedRoute><TeammateDocumentViewer /></ProtectedRoute>),
      },
      {
        path: "/chatroom",
        element: (<ProtectedRoute>
        <TeamChatPage />
        </ProtectedRoute>),
      },
      {
        path: "/user-profile-page",
        element: (<ProtectedRoute><UserProfilePage /></ProtectedRoute>),
      },
      {
        path: "/confirmation-page/:teamName",
        element:(<ProtectedRoute>
        <TeamConfirmationPage />
        </ProtectedRoute>
        ),
      },
      {
        path: "/trip-dashboard",
        element: (
          <ProtectedRoute>
            <TripDashboard />
            </ProtectedRoute>
         
        ),
      },
      {
        path: "/doument-upload",
        element: (<ProtectedRoute>
        <DocumentUploadPage />
        </ProtectedRoute>
      ),
      },
      {
        path: "/team-registration/:members",
        element: (<ProtectedRoute>
        <TeamRegistration />
        </ProtectedRoute>),
      },
      {
        path: "/expense-upload",
        element: (<ProtectedRoute>
        <ExpenseUpload />
        </ProtectedRoute>
      ),
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

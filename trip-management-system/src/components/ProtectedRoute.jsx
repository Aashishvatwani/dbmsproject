import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Store the current location to redirect back after login
        return <Navigate to={`/login?redirect=${location.pathname}`} />;
    }

    return children;
};

export default ProtectedRoute;
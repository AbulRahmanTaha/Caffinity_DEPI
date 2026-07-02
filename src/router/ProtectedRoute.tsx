import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useUser();

    if (loading) {
        return <div className="text-center py-40">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

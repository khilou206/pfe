import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


export const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Chargement...</div>;


    return user && user.role === 'administrateur' ? <Outlet /> : <Navigate to="/" />;
};


export const UserRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Chargement...</div>;

    
    return user && user.role === 'utilisateur' ? <Outlet /> : <Navigate to="/AdminDashboard" />;
};
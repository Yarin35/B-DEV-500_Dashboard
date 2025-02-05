import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
        console.error('User not logged in. Redirecting to login page.');
    }
    return isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRoute;
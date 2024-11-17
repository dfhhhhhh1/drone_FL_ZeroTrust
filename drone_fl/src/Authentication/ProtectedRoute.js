import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import checkAuth from "./Authentication";

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            const auth = await checkAuth();
            setIsAuth(auth);
        };
        verifyAuth();
    }, []);

    if (isAuth === null) {
        return <p>Loading...</p>
    }

    if (!isAuth) {
        return <Navigate to='../login' />;
    }

    return children;
}

export default ProtectedRoute;
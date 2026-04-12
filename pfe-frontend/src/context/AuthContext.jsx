import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, [token]);

   const login = (userData, userToken) => {
    localStorage.setItem('token', userToken); // استعمل 'token' هنا
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(userToken);
};

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
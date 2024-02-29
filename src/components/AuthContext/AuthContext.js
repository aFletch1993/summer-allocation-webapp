import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('userToken');
        if(token) {
            setIsAuthenticated(true);
            setUserToken(token);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.token) {
                sessionStorage.setItem('userToken', data.token);
                setIsAuthenticated(true);
                setUserToken(data.token);

            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logout = () => {
        sessionStorage.removeItem('userToken');
        setIsAuthenticated(false);
        setUserToken(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
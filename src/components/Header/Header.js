import React from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import './Header.css';

function Header() {
    const {isAuthenticated, logout } = useAuth();

    return (
        <div className="header">
            <h1 className="header-title">ToDo List</h1>
            <nav className="header-nav">
                {isAuthenticated && (
                    <button onClick={logout}>Logout</button>
                )}
            </nav>
        </div>

    );
}

export default Header;
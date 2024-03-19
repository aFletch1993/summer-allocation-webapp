import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';

const ToDoLogin = ({ onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const { login } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const success = await login(username, password);
            if (success) {
                onClose();
            } else {
                setError('Invalid credentials.');
            }
        } catch (error) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default ToDoLogin;
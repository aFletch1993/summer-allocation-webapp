import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const success = await login(username, password);
        if (success) {
            console.log("Login successful.");
        } else {
            console.log("Login failed.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Username"
            onChange={e => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
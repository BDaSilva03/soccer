import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin, onSwitch }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('/login', formData);
            localStorage.setItem('token', response.data.token);
            setMessage('Logged in successfully');
            onLogin(); // Call the prop function when login is successful
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div>
            <input value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="Username" />
            <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
            <button onClick={onSwitch}>Switch to Register</button> {/* Button to switch to Register */}
            <p>{message}</p>
        </div>
    );
}

export default Login;

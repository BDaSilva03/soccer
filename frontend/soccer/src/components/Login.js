import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('/login', formData);
            localStorage.setItem('token', response.data.token);
            setMessage('Logged in successfully');
            onLogin(); // Call the prop function when login is successful
            navigate('/game'); // Redirect to game page
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div>
            <input className="form-control mb-2" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="Username" />
            <input type="password" className="form-control mb-2" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Password" />
            <button className="btn btn-primary mb-2" onClick={handleLogin}>Login</button>
            <p>{message}</p>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
}

export default Login;

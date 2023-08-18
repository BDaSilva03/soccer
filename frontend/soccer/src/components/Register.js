import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegistered }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('/register', formData);
            
            if (response && response.data) {  // Check if response and response.data exist
                setMessage(response.data.message);
                onRegistered(); // Call the prop function when registration is successful
            } else {
                setMessage('Unexpected server response.');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage('Error occurred during registration.');
            }
        }
    };
    

    return (
        <div>
            <input value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="Username" />
            <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Password" />
            <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
            <button onClick={handleRegister}>Register</button>
            <p>{message}</p>
        </div>
    );
}

export default Register;

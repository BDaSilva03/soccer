import React, { useState } from 'react';
import axios from 'axios';

// The Register component provides the UI and logic for registering a new user.
function Register({ onRegistered }) {
    // State for form data and any messages to display to the user
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [message, setMessage] = useState('');

    // Handle the registration process when the register button is clicked
    const handleRegister = async () => {
        try {
            const response = await axios.post('/register', formData);
            
            if (response && response.data) {
                setMessage(response.data.message);
                onRegistered(); // Notify parent component of successful registration
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

    // Render the registration form
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

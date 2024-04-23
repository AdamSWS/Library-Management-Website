import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

export default function ClientSignup({ onSignup }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/signup/client', { email, name });
            if (response.data) {
                onSignup({ role: 'client', email, ...response.data.user });
            }
        } catch (error) {
            setError(error.response.data.message || "An error occurred during signup.");
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <p className="text-danger">{error}</p>}
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
            </Form.Group>
            
            <Form.Group controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Full Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required 
                />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-4">
                Signup
            </Button>
        </Form>
    );
}

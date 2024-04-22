import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

export default function ClientLogin({ onLogin }) {
    // data needed for Postgres database
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    // button handler for submitting client data
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // attempt to connect to server
            const response = await axios.post('http://localhost:4000/login/client', { email, name });
            if (response.data.success) {
                onLogin({ role: 'client', email, ...response.data.user });
            } else {
                setError(response.data.message || "Invalid credentials.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred during login.");
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <p className="text-danger">{error}</p>}
            <Form.Group controlId="clientName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="clientEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3">
                Login
            </Button>
        </Form>
    );
}

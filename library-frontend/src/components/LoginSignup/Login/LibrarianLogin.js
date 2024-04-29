import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

export default function LibrarianLogin({ onLogin }) {
    const [email, setEmail] = useState('');
    const [ssn, setSSN] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Send a POST request to the server
            // to login the librarian with the given email and SSN
            // The server should respond with a success message and the user details
            
            const response = await axios.post('http://localhost:4000/login/librarian', { email, ssn });
            if (response.data.success) {
                onLogin({ role: 'librarian', email, ssn, ...response.data.user });
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
            <Form.Group controlId="librarianEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="librarianSSN">
                <Form.Label>SSN</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter SSN"
                    value={ssn}
                    onChange={(e) => setSSN(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3">
                Login
            </Button>
        </Form>
    );
}

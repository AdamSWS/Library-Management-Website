import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

export default function LibrarianSignup({ onSignup }) {
    const [ssn, setSSN] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [salary, setSalary] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/signup/librarian', { ssn, name, email, salary });
            if (response.data.success) {
                onSignup({ role: 'librarian', email, ssn, ...response.data.user });
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred during signup.");
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <p className="text-danger">{error}</p>}
            <Form.Group controlId="formBasicSSN">
                <Form.Label>SSN</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Enter SSN" 
                    value={ssn} 
                    onChange={(e) => setSSN(e.target.value)} 
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

            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
            </Form.Group>

            <Form.Group controlId="formBasicSalary">
                <Form.Label>Salary</Form.Label>
                <Form.Control 
                    type="number" 
                    placeholder="Salary" 
                    value={salary} 
                    onChange={(e) => setSalary(e.target.value)}
                    required 
                />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-4">
                Signup
            </Button>
        </Form>
    );
}

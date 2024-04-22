import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import LibrarianLogin from './LibrarianLogin';
import ClientLogin from './ClientLogin';

export default function Login({ onLogin, onToggleSignup }) {
    // Login Screen trigger
    const [role, setRole] = useState('');

    return (
        <Container className="d-flex vh-100">
            <Row className="m-auto align-self-center w-100">
                <Col md={8} lg={6} className="mx-auto">
                    <div className="p-5 border rounded-3 bg-light shadow-lg">
                        <h2 className="text-center mb-4 font-weight-bold">Login to Library Manager</h2>
                        <Form.Group controlId="formBasicRole" className="mb-4">
                            <Form.Label>Role</Form.Label>
                            <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)} required>
                                <option value="">Select Role</option>
                                <option value="client">Client</option>
                                <option value="librarian">Librarian</option>
                            </Form.Control>
                        </Form.Group>

                        {role === 'librarian' && <LibrarianLogin onLogin={onLogin} />}
                        {role === 'client' && <ClientLogin onLogin={onLogin} />}

                        <div className="mt-3 text-center">
                            <Button variant="link" onClick={onToggleSignup}>Don't have an account? Sign up</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

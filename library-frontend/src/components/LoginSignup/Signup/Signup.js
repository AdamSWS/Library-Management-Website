import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LibrarianSignup from './LibrarianSignup';
import ClientSignup from './ClientSignup';

export default function Signup({ onSignup, onToggleLogin }) {
    // Signup Screen trigger
    const [role, setRole] = useState('');

    return (
        <Container className="d-flex vh-100">
            <Row className="m-auto align-self-center w-100">
                <Col md={8} lg={6} className="mx-auto">
                    <div className="p-5 border rounded-3 bg-light shadow-lg">
                        <h2 className="text-center mb-4 font-weight-bold">Signup for Library Manager</h2>
                        <select
                            className="form-control mb-4"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required>
                            <option value="">Select Role</option>
                            <option value="client">Client</option>
                            <option value="librarian">Librarian</option>
                        </select>
                        {role === 'librarian' && <LibrarianSignup onSignup={onSignup} />}
                        {role === 'client' && <ClientSignup onSignup={onSignup} />}
                        <button className="btn btn-link mt-3" onClick={onToggleLogin}>Already have an account? Sign in</button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

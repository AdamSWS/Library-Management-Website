import React from "react";
import { Nav, Navbar, Button } from "react-bootstrap";
import logoImage from '../../assets/logo_lib_manager.png';

export default function LibManagerNavbar({ userRole, onLogout }) {
    const displayRole = userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "N/A";

    return (
        <Navbar expand="lg" className="bg-blue-600 shadow-lg py-2 px-5 flex items-center justify-between">
            <Navbar.Brand href="#home" className="text-white text-xl font-semibold flex items-center">
                <img src={logoImage} alt="Library Logo" className="h-12 mr-2.5" />
                LIBRARY MANAGER
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto flex items-center">
                    {userRole && <Button variant="outline-light" onClick={onLogout}>Sign Out</Button>}
                </Nav>
            </Navbar.Collapse>
            <div className="text-white px-3 py-2 rounded-md text-sm font-medium" style={{ whiteSpace: 'nowrap' }}>
                Role: {displayRole}
            </div>
        </Navbar>
    );
}

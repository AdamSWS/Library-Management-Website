import React from "react";
import { Nav, Navbar, Button } from "react-bootstrap";
import logoImage from '../../assets/logo_lib_manager.png';

export default function LibManagerNavbar({ user, onLogout }) {
    const displayRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "N/A";
    const userEmail = user?.email ? user.email : "No email";

    return (
        <Navbar expand="lg" className="bg-blue-600 shadow-lg py-2 px-5 flex items-center justify-between">
            <Navbar.Brand href="#home" className="text-white text-xl font-semibold flex items-center">
                <img src={logoImage} alt="Library Logo" className="h-12 mr-2.5" />
                LIBRARY MANAGER
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
            <div className="text-white px-3 py-2 rounded-md text-sm font-medium text-center
            " style={{ whiteSpace: 'nowrap' }}>
                <b>Role:</b> {displayRole}  <b>Email:</b> {userEmail}
            </div>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto flex items-center">
                    {user && <Button variant="outline-light" onClick={onLogout}>Sign Out</Button>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import LibManagerNavbar from "./components/Navbar/LibManagerNavbar";
import LoginScreen from './components/LoginSignup/LoginScreen';
import LibrarianDashboard from './components/Librarian/LibrarianDashboard';
import ClientDashboard from './components/Client/ClientDashboard';
import backgroundImage from './assets/library_background_image.jpeg';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (user && user.email && user.role) {
            const fetchUserData = async () => {
                try {
                    const endpoint = user.role === 'librarian' ? `/librarian/${user.email}` : `/client/${user.email}`;
                    const response = await axios.get(`http://localhost:4000${endpoint}`);
                    setUser({...user, ...response.data.data});
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUserData();
        }
    }, [user?.email, user?.role]);

    const handleLogin = (userData) => {
        setUser(userData);
        console.log(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <LibManagerNavbar user={user} onLogout={handleLogout} />
            {!user ? (
                <LoginScreen onLogin={handleLogin} />
            ) : user.role === 'librarian' ? (
                <LibrarianDashboard user={user} />
            ) : (
                <ClientDashboard user={user} />
            )}
        </div>
    );
}

export default App;

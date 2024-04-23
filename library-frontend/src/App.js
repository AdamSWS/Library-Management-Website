import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LibManagerNavbar from "./components/Navbar/LibManagerNavbar";
import LoginScreen from './components/LoginSignup/LoginScreen';
import LibrarianDashboard from './components/Librarian/LibrarianDashboard';
import ClientDashboard from './components/Client/ClientDashboard';
import backgroundImage from './assets/library_background_image.jpeg';

function App() {
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);
        console.log(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <LibManagerNavbar userRole={user?.role} onLogout={handleLogout} />
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

import React, { useState } from 'react';
import Login from './Login/Login';
import Signup from './Signup/Signup';

export default function LoginScreen({ onLogin }) {
    // triggering data for login screen
    const [showLogin, setShowLogin] = useState(true);

    const handleToggle = () => {
        setShowLogin(!showLogin);
    };

    return (
        <div className="container mt-4">
            {showLogin ? (
                <Login onLogin={onLogin} onToggleSignup={handleToggle} />
            ) : (
                <Signup onSignup={onLogin} onToggleLogin={handleToggle} />
            )}
        </div>
    );
}

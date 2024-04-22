import React, { useState } from 'react';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = () => {
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-header">
                    <h2 className="h4 font-weight-bold">Notifications</h2>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Message</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.length > 0 ? (
                                notifications.map(notification => (
                                    <tr key={notification.id}>
                                        <td>{notification.type}</td>
                                        <td>{notification.message}</td>
                                        <td>{notification.date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No new notifications.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

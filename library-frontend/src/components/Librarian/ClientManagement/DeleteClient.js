import React, { useState } from 'react';
import axios from 'axios';

function DeleteClient() {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [emailToFetch, setEmailToFetch] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmailToFetch(event.target.value);
    };

    const fetchClients = async () => {
        if (searchTerm === '') {
            alert('Please enter a search term.');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:4000/clients/search?term=${searchTerm}`);
            setClients(response.data.data);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
            alert('Failed to load clients. Please try again later.');
        }
    };

    const fetchClientByEmail = async () => {
        if (emailToFetch === '') {
            alert('Please enter an email to fetch.');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:4000/client/${encodeURIComponent(emailToFetch)}`);
            if (response.data.success) {
                setClients([response.data.data]);
            } else {
                alert(response.data.message || 'Client not found');
                setClients([]);
            }
        } catch (error) {
            alert('Failed to fetch client details');
            console.error('Fetch Error:', error);
        }
    };

    const handleDelete = (email) => {
        axios.delete(`http://localhost:4000/clients/${email}`)
            .then(response => {
                if (response.data.success) {
                    alert('Client deleted successfully!');
                    setClients(currentClients => currentClients.filter(client => client.email !== email));
                } else {
                    alert('Failed to delete client.');
                }
            })
            .catch(error => {
                console.error('Failed to delete client:', error);
                alert('Failed to delete client.');
            });
    };

    return (
        <div className="container mx-auto mt-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Client Management - Delete Client</h2>

                <div className="mb-4 flex gap-3">
                    <input
                        type="email"
                        placeholder="Enter email to fetch client"
                        value={emailToFetch}
                        onChange={handleEmailChange}
                        className="form-control block flex-grow px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                    <button onClick={fetchClientByEmail} className="btn bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Search
                    </button>
                </div>
                {clients.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                        {clients.map(client => (
                            <li key={client.email} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                <span className="font-medium text-gray-900">{client.name} ({client.email})</span>
                                <button onClick={() => handleDelete(client.email)} className="btn btn-danger text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded px-4 py-1">
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No clients found.</p>
                )}
            </div>
        </div>
    );
}

export default DeleteClient;

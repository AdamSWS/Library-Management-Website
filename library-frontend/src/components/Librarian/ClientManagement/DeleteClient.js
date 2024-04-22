import React, { useState } from 'react';

function DeleteClient({ clients, handleDelete }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto mt-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Client Management - Delete Client</h2>
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none mb-4"
                />
                <ul className="list-disc list-inside space-y-2">
                    {filteredClients.length > 0 ? (
                        filteredClients.map(client => (
                            <li key={client.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                <span className="font-medium text-gray-900">{client.name} ({client.email})</span>
                                <button onClick={() => handleDelete(client.id)} className="btn btn-danger text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded px-4 py-1">
                                    Delete
                                </button>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-600">No clients found matching the search criteria.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default DeleteClient;

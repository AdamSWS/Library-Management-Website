import React, { useState } from 'react';
import axios from 'axios';

function EditClient() {
    const [clientData, setClientData] = useState({
        currentEmail: '',
        newEmail: '',
        name: '',
    });
    const [isFetched, setIsFetched] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientData(prev => ({ ...prev, [name]: value }));
    };

    const handleFetchClient = async () => {
        if (!clientData.currentEmail) {
            alert('Please enter a client email');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:4000/client/${encodeURIComponent(clientData.currentEmail)}`);
            if (response.data.success) {
                setClientData({
                    currentEmail: response.data.data.email,
                    newEmail: response.data.data.email,
                    name: response.data.data.name,
                });
                setIsFetched(true);
            } else {
                alert(response.data.message || 'Client not found');
                setIsFetched(false);
            }
        } catch (error) {
            alert('Failed to fetch client details');
            console.error('Fetch Error:', error);
            setIsFetched(false);
        }
    };
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                currentEmail: clientData.currentEmail,
                newEmail: clientData.newEmail,
                name: clientData.name,
            };

            const response = await axios.post('http://localhost:4000/update/client', updateData);
            if (response.data.success) {
                alert('Client updated successfully');
                setIsFetched(false); // Optionally reset form or fetch state
            } else {
                alert('Failed to update client');
            }
        } catch (error) {
            console.error('Error updating client:', error);
            alert('Failed to update client: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div className="container mx-auto mt-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Update Client</h2>
                <div className="mb-3">
                    <label htmlFor="currentEmail" className="block text-gray-700 text-sm font-bold mb-2">Current Client Email:</label>
                    <input
                        type="email"
                        id="currentEmail"
                        name="currentEmail"
                        value={clientData.currentEmail}
                        onChange={handleChange}
                        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                        placeholder="Enter current client email"
                    />
                    <button onClick={handleFetchClient} className="mt-2 text-white bg-blue-500 hover:bg-blue-700 font-medium py-2 px-4 rounded">Fetch Client</button>
                </div>
                {isFetched && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <label htmlFor="newEmail" className="flex-none w-28 text-right font-bold">New Email (optional):</label>
                            <input type="email" id="newEmail" name="newEmail" value={clientData.newEmail} onChange={handleChange} className="form-control flex-auto" placeholder="Enter new email" />
                        </div>
                        <div className="flex items-center space-x-3">
                            <label htmlFor="name" className="flex-none w-28 text-right font-bold">Name:</label>
                            <input type="text" id="name" name="name" value={clientData.name} onChange={handleChange} className="form-control flex-auto" placeholder="Enter name" />
                        </div>
                        <button type="submit" className="btn btn-primary w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                            Update Client
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default EditClient;

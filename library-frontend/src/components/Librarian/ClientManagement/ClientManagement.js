import React, { useState, useEffect } from 'react';
import RegisterClient from './RegisterClient';
import EditClient from './EditClient';
import DeleteClient from './DeleteClient';

export default function ClientManagement() {
    const [currentTab, setCurrentTab] = useState('register');
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', address: '', creditCard: '' });
    const [editFormData, setEditFormData] = useState({ id: null, name: '', email: '', address: '', creditCard: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newData = currentTab === 'register' ? formData : editFormData;
        const setData = currentTab === 'register' ? setFormData : setEditFormData;
        setData({ ...newData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setClients([...clients, { ...formData, id: clients.length + 1 }]);
        setFormData({ name: '', email: '', address: '', creditCard: '' });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        setClients(clients.map(client => client.id === editFormData.id ? editFormData : client));
        setEditFormData({ id: null, name: '', email: '', address: '', creditCard: '' });
    };

    const handleDelete = (id) => {
        setClients(clients.filter(client => client.id !== id));
    };

    const handleSelectClient = (client) => {
        setEditFormData(client);
        setCurrentTab('edit');
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-header">
                    <h2 className="h4 font-weight-bold">Client Management</h2>
                </div>
                <div className="card-body">
                    <ul className="nav nav-tabs d-flex" style={{flexDirection: 'row'}}>
                        <li className="nav-item flex-grow-1 text-center">
                            <a className={`nav-link ${currentTab === 'register' ? 'active' : ''}`} onClick={() => setCurrentTab('register')} style={{cursor: 'pointer'}}>Register Client</a>
                        </li>
                        <li className="nav-item flex-grow-1 text-center">
                            <a className={`nav-link ${currentTab === 'edit' ? 'active' : ''}`} onClick={() => setCurrentTab('edit')} style={{cursor: 'pointer'}}>Edit Client</a>
                        </li>
                        <li className="nav-item flex-grow-1 text-center">
                            <a className={`nav-link ${currentTab === 'delete' ? 'active' : ''}`} onClick={() => setCurrentTab('delete')} style={{cursor: 'pointer'}}>Delete Client</a>
                        </li>
                    </ul>

                    <div className="tab-content mt-4">
                        {currentTab === 'register' && <RegisterClient formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />}
                        {currentTab === 'edit' && <EditClient editFormData={editFormData} handleInputChange={handleInputChange} handleEdit={handleEdit} />}
                        {currentTab === 'delete' && <DeleteClient clients={clients} handleDelete={handleDelete} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

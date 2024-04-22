import React, { useState } from 'react';
import AddDocument from './AddDocuments/AddDocument';
import UpdateDocument from './UpdateDocuments/UpdateDocument';
import DeleteDocument from './DeleteDocuments/DeleteDocument';

export default function DocumentManagement() {
    const [currentTab, setCurrentTab] = useState('add');
    const [documents, setDocuments] = useState([]);
    const [formData, setFormData] = useState({ documentType: '', title: '' });
    const [editFormData, setEditFormData] = useState({ documentID: '', documentType: '', title: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newData = currentTab === 'add' ? formData : editFormData;
        const setData = currentTab === 'add' ? setFormData : setEditFormData;
        setData({ ...newData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setDocuments([...documents, { ...formData, id: documents.length + 1 }]);
        setFormData({ documentType: '', title: '' });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        // Update logic here
    };

    const handleDelete = () => {
        // Delete logic here
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-header">
                    <h2 className="h4 font-weight-bold">Document Management</h2>
                </div>
                <div className="card-body">
                    <ul className="nav nav-tabs d-flex" style={{ flexDirection: 'row' }}>
                        <li className="nav-item flex-grow-1 text-center">
                            <a className={`nav-link ${currentTab === 'add' ? 'active' : ''}`} onClick={() => setCurrentTab('add')} style={{ cursor: 'pointer' }}>Add Document</a>
                        </li>
                        <li className="nav-item flex-grow-1 text-center">
                            <a className={`nav-link ${currentTab === 'update' ? 'active' : ''}`} onClick={() => setCurrentTab('update')} style={{ cursor: 'pointer' }}>Update Document</a>
                        </li>
                        <li className="nav-item flex-grow-1 text-center">
                            <a className={`nav-link ${currentTab === 'delete' ? 'active' : ''}`} onClick={() => setCurrentTab('delete')} style={{ cursor: 'pointer' }}>Delete Document</a>
                        </li>
                    </ul>

                    <div className="tab-content mt-4">
                        {currentTab === 'add' && <AddDocument formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />}
                        {currentTab === 'update' && <UpdateDocument editFormData={editFormData} handleInputChange={handleInputChange} handleEdit={handleEdit} />}
                        {currentTab === 'delete' && <DeleteDocument handleDelete={handleDelete} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

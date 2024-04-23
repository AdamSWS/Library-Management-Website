import React, { useState } from 'react';
import axios from 'axios';

export default function DeleteDocument() {
    const [documentId, setDocumentId] = useState('');

    const handleChange = (e) => {
        setDocumentId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!documentId) {
            alert("Please enter a Document ID.");
            return;
        }
        try {
            const response = await axios.delete(`http://localhost:4000/delete/document/${documentId}`);
            if (response.data.success) {
                alert('Document deleted successfully');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Failed to delete document: ' + (error.response ? error.response.data.message : error.message));
        }
        setDocumentId('');
    };

    return (
        <div className="container mx-auto mt-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Delete Document</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="documentId" className="block text-gray-700 text-sm font-bold mb-2">Document ID:</label>
                        <input type="text" id="documentId" value={documentId} onChange={handleChange} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Enter document ID" />
                    </div>
                    <button type="submit" className="btn btn-danger w-full">Delete Document</button>
                </form>
            </div>
        </div>
    );
}

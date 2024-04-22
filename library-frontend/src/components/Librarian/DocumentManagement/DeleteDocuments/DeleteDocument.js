import React, { useState } from 'react';

export default function DeleteDocument() {
    const [documentId, setDocumentId] = useState('');

    const handleChange = (e) => {
        setDocumentId(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Deleting Document ID:', documentId);
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

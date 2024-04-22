import React, { useState } from 'react';
import AddBook from './AddBook';
import AddMagazine from './AddMagazine';
import AddJournalArticle from './AddJournalArticle';

export default function AddDocument() {
    const [docType, setDocType] = useState('Book');

    const handleDocTypeChange = (e) => {
        setDocType(e.target.value);
    };

    const renderDocumentForm = () => {
        switch(docType) {
            case 'Book':
                return <AddBook />;
            case 'Magazine':
                return <AddMagazine />;
            case 'Journal Article':
                return <AddJournalArticle />;
            default:
                return <div>Please select a document type</div>;
        }
    };

    return (
        <div className="container mx-auto mt-4">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Add New Document</h2>
                <div className="mb-4">
                    <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Document Type:</label>
                    <select id="type" name="type" value={docType} onChange={handleDocTypeChange} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                        <option value="Book">Book</option>
                        <option value="Magazine">Magazine</option>
                        <option value="Journal Article">Journal Article</option>
                    </select>
                </div>
                {renderDocumentForm()}
            </div>
        </div>
    );
}

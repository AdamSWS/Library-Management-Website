import React, { useState } from 'react';

export default function UpdateDocument() {
    const [documentData, setDocumentData] = useState({
        id: '',
        title: '',
        authors: '',
        isbn: '',
        publisher: '',
        year: '',
        edition: '',
        pages: '',
        month: '',
        issue: ''
    });
    const [docType, setDocType] = useState('Book');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocumentData(prev => ({ ...prev, [name]: value }));
    };

    const handleFetchDocument = () => {
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="container mx-auto mt-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Update Document</h2>
                <div className="mb-3">
                    <label htmlFor="id" className="block text-gray-700 text-sm font-bold mb-2">Document ID:</label>
                    <input type="text" id="id" name="id" value={documentData.id} onChange={handleChange} className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Enter document ID" />
                    <button onClick={handleFetchDocument} className="mt-2 text-white bg-blue-500 hover:bg-blue-700 font-medium py-2 px-4 rounded">Fetch Document</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <label htmlFor="title" className="flex-none w-28 text-right font-bold">Title</label>
                        <input type="text" id="title" name="title" value={documentData.title} onChange={handleChange} className="form-control flex-auto" placeholder="Enter title" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="authors" className="flex-none w-28 text-right font-bold">Authors</label>
                        <input type="text" id="authors" name="authors" value={documentData.authors} onChange={handleChange} className="form-control flex-auto" placeholder="Author names" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="isbn" className="flex-none w-28 text-right font-bold">ISBN</label>
                        <input type="text" id="isbn" name="isbn" value={documentData.isbn} onChange={handleChange} className="form-control flex-auto" placeholder="ISBN number" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="publisher" className="flex-none w-28 text-right font-bold">Publisher</label>
                        <input type="text" id="publisher" name="publisher" value={documentData.publisher} onChange={handleChange} className="form-control flex-auto" placeholder="Publisher name" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="year" className="flex-none w-28 text-right font-bold">Year</label>
                        <input type="text" id="year" name="year" value={documentData.year} onChange={handleChange} className="form-control flex-auto" placeholder="Publication year" />
                    </div>
                    {docType === 'Book' && (
                        <>
                            <div className="flex items-center space-x-3">
                                <label htmlFor="edition" className="flex-none w-28 text-right font-bold">Edition</label>
                                <input type="text" id="edition" name="edition" value={documentData.edition} onChange={handleChange} className="form-control flex-auto" placeholder="Edition number" />
                            </div>
                            <div className="flex items-center space-x-3">
                                <label htmlFor="pages" className="flex-none w-28 text-right font-bold">Pages</label>
                                <input type="text" id="pages" name="pages" value={documentData.pages} onChange={handleChange} className="form-control flex-auto" placeholder="Number of pages" />
                            </div>
                        </>
                    )}
                    <button type="submit" className="btn btn-primary w-full">Update Document</button>
                </form>
            </div>
        </div>
    );
}

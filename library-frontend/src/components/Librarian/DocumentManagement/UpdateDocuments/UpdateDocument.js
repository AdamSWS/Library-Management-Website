import React, { useState } from 'react';
import axios from 'axios';

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
        issue: '',
        article_number: '',
        type: ''
    });
    const [isFetched, setIsFetched] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocumentData(prev => ({ ...prev, [name]: value }));
    };

    const handleFetchDocument = async () => {
        if (!documentData.id) {
            alert('Please enter a document ID');
            return;
        }
        try {
            const response = await axios.get(`http://localhost:4000/document/${documentData.id}`);
            if (response.data.success) {
                const { data } = response.data;
                setDocumentData({
                    ...documentData,
                    title: data.title,
                    authors: data.authors,
                    isbn: data.isbn,
                    publisher: data.publisher,
                    year: data.year,
                    edition: data.details.edition || '',
                    pages: data.details.pages || '',
                    month: data.details.month || '',
                    issue: data.details.issue_number || '',
                    article_number: data.details.article_number || '',
                    type: data.type
                });
                setIsFetched(true);
            } else {
                alert('Document not found');
                setIsFetched(false);
            }
        } catch (error) {
            alert('Failed to fetch document');
            console.error('Fetch Error:', error);
            setIsFetched(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateData = {
            id: documentData.id,
            title: documentData.title,
            authors: documentData.authors,
            isbn: documentData.isbn,
            publisher: documentData.publisher,
            year: documentData.year,
            type: documentData.type
        };
    
        if (documentData.type === 'Book') {
            updateData.edition = documentData.edition;
            updateData.pages = documentData.pages;
        } else if (documentData.type === 'Magazine') {
            updateData.month = documentData.month;
        } else if (documentData.type === 'JournalArticle') {
            updateData.issue_number = documentData.issue;
            updateData.article_number = documentData.article_number;
        }
    
        try {
            const response = await axios.post('http://localhost:4000/update/document', updateData);
            if (response.data.success) {
                alert('Document updated successfully');
            } else {
                alert('Failed to update document');
            }
        } catch (error) {
            console.error('Error updating document:', error);
            alert('Failed to update document: ' + (error.response ? error.response.data.message : error.message));
        }
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
                {isFetched && (
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
                    {documentData.type === 'Book' && (
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
                    {documentData.type === 'Magazine' && (
                        <div className="flex items-center space-x-3">
                            <label htmlFor="month" className="flex-none w-28 text-right font-bold">Month</label>
                            <input type="text" id="month" name="month" value={documentData.month} onChange={handleChange} className="form-control flex-auto" placeholder="Month of issue" />
                        </div>
                    )}
                    {documentData.type === 'JournalArticle' && (
                        <>
                            <div className="flex items-center space-x-3">
                                <label htmlFor="issue" className="flex-none w-28 text-right font-bold">Issue Number</label>
                                <input type="text" id="issue" name="issue" value={documentData.issue} onChange={handleChange} className="form-control flex-auto" placeholder="Issue number" />
                            </div>
                            <div className="flex items-center space-x-3">
                                <label htmlFor="article_number" className="flex-none w-28 text-right font-bold">Article Number</label>
                                <input type="text" id="article_number" name="article_number" value={documentData.article_number} onChange={handleChange} className="form-control flex-auto" placeholder="Article number" />
                            </div>
                        </>
                    )}
                    <button type="submit" className="btn btn-primary w-full">Update Document</button>
                </form>
                )}
            </div>
        </div>
    );
}

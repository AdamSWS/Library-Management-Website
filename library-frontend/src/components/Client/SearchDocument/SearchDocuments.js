import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import DocumentRow from './DocumentRow';

// formats dates to be added to database
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date();
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// find number of weeks in a time period
function addWeeksToDate(date, weeks) {
    date.setDate(date.getDate() + weeks * 7);
    return date;
}

// componet to display search documents dashboard
export default function SearchDocuments({ user }) {
    const [searchParams, setSearchParams] = useState({ query: '', type: 'All'});
    const [results, setResults] = useState([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const [lendDate, setLendDate] = useState(formatDate(new Date()));
    const [returnDate, setReturnDate] = useState(formatDate(addWeeksToDate(new Date(), 4)));
    const [loading, setLoading] = useState(false);

    // handler for search button to look up documents in database
    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/search/documents', searchParams);
            const documents = response.data.data;

            if (documents.length > 0) {
                const documentIds = documents.map(doc => doc.document_id);
                const copiesResponse = await axios.post('http://localhost:4000/document/copies', { documentIds });
                const copiesCount = copiesResponse.data.data;

                const resultsWithCopies = documents.map(doc => ({
                    ...doc,
                    copies: copiesCount.find(c => c.document_id === doc.document_id)?.copy_count || 0
                }));

                setResults(resultsWithCopies);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error('Error searching documents:', error);
            alert('Failed to fetch documents. Please try again.');
        }
        setLoading(false);
    };

    // handles changes in text forms from user
    const handleInputChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    // handles the date change in the calander component
    const handleDateChange = (date) => {
        const lendDate = formatDate(date);
        const returnDate = formatDate(addWeeksToDate(new Date(date), 4));
        setLendDate(lendDate);
        setReturnDate(returnDate);
    };

    // handles user row clicks to select a doc
    const handleRowClick = (document) => {
        setSelectedDocumentId(document);
    };

    // handles clicks to the lend button to add a Lending to the database
    const handleLendCopy = async () => {
        if (selectedDocumentId && user && lendDate && returnDate) {
            setLoading(true);
            try {
                console.log(selectedDocumentId.document_id);
                const response = await axios.post('http://localhost:4000/create/lending', {
                    document_id: selectedDocumentId.document_id,
                    client_email: user.email,
                    lend_date: lendDate,
                    return_date: returnDate
                });
                alert(`Copy lent successfully! Lending ID: ${response.data.lendingId}`);
                handleSearch();
            } catch (error) {
                console.error('Error creating lending record:', error);
                alert('Failed to create lending record. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please select a document and ensure all fields are filled correctly.');
        }
    };

    // select doc logic
    const selectedDocument = results.find(doc => doc === selectedDocumentId);

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header">
                    <h2 className="h4 font-weight-bold">Search Documents</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="mb-3">
                                <label htmlFor="query" className="form-label">Search Query</label>
                                <input type="text" id="query" name="query" value={searchParams.query} onChange={handleInputChange} className="form-control" placeholder="Enter title, author, or ISBN" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="type" className="form-label">Search Type</label>
                                <select id="type" name="type" value={searchParams.type} onChange={handleInputChange} className="form-control">
                                    <option value="All">All</option>
                                    <option value="Title">Title</option>
                                    <option value="Author">Author</option>
                                    <option value="ISBN">ISBN</option>
                                </select>
                            </div>
                            <button onClick={handleSearch} className="btn btn-primary">Search</button>
                        </div>
                        <div className="col-md-4" style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '5px' }}>
                            <div className="mb-3">
                                <h5>Selected Document:</h5>
                                {selectedDocument ? (
                                    <>
                                        <p><strong>{selectedDocument.title}</strong> - Copies: {selectedDocument.copies}</p>
                                        <div className="mb-3">
                                            <label htmlFor="lendDate" className="form-label">Lend Date</label>
                                            <input type="date" id="lendDate" name="lendDate" value={lendDate} onChange={e => handleDateChange(e.target.value)} className="form-control" />
                                            <p className="mt-3"><strong>Return Date:</strong> {returnDate}</p>
                                        </div>
                                        <Button onClick={handleLendCopy} variant="success">Lend Copy</Button>
                                    </>
                                ) : (
                                    <p>No document selected.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {loading && <p>Loading...</p>}
                    <div className="mt-4">
                        <h3>Results:</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Authors</th>
                                    <th>Year</th>
                                    <th>ISBN</th>
                                    <th>Copies</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(result => (
                                    <DocumentRow
                                        key={result.document_id}
                                        document={result}
                                        isSelected={selectedDocumentId === result.document_id}
                                        onSelect={handleRowClick}
                                    />
                                ))}
                            </tbody>
                        </table>
                        {!loading && results.length === 0 && <p>No documents found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

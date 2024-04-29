import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import DocumentRow from './DocumentRow'; // Ensure the import path is correct

function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(); // Use current date if input is invalid
    }

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
    const day = date.getDate().toString().padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`;
}

function addWeeksToDate(date, weeks) {
    date.setDate(date.getDate() + weeks * 7);
    return date;
}

export default function SearchDocuments({ user }) {
    const [searchParams, setSearchParams] = useState({ query: '', type: 'All' });
    const [results, setResults] = useState([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const [lendDate, setLendDate] = useState(formatDate(new Date()));
    const [returnDate, setReturnDate] = useState(formatDate(addWeeksToDate(new Date(), 4))); // Set return date to 4 weeks from today
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/search/documents', searchParams);
            setResults(response.data.data);
        } catch (error) {
            console.error('Error searching documents:', error);
            alert('Failed to fetch documents. Please try again.');
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        const lendDate = formatDate(date);
        const returnDate = formatDate(addWeeksToDate(new Date(date), 4));
        setLendDate(lendDate);
        setReturnDate(returnDate);
    };

    const handleRowClick = (document) => {
        setSelectedDocumentId(document);
    };

    const handleLendCopy = async () => {
        if (selectedDocumentId && user && lendDate && returnDate) {
            setLoading(true);
            try {
                console.log(selectedDocumentId.document_id);
                const response = await axios.post('http://localhost:4000/create/lending', {
                    copy_id: selectedDocumentId.document_id,
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
                                <label htmlFor="type" className="form-label">Document Type</label>
                                <select id="type" name="type" value={searchParams.type} onChange={handleInputChange} className="form-control">
                                    <option value="All">All</option>
                                    <option value="Book">Book</option>
                                    <option value="Magazine">Magazine</option>
                                    <option value="Journal Article">Journal Article</option>
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

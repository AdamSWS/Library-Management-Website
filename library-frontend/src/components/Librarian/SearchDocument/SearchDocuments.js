import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import DocumentRow from './DocumentRow'; // Ensure the import path is correct

export default function SearchDocuments() {
    const [searchParams, setSearchParams] = useState({ query: '', type: 'All' });
    const [results, setResults] = useState([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [numCopiesToAdd, setNumCopiesToAdd] = useState(0);
    const [addError, setAddError] = useState('');

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

    const handleInputChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleRowClick = (document) => {
        setSelectedDocumentId(document);
        console.log(document);
    };

    const handleAddCopiesInputChange = (e) => {
        setNumCopiesToAdd(parseInt(e.target.value) || 0);
    };

    const handleAddCopies = async () => {
        if (selectedDocumentId && numCopiesToAdd > 0) {
            setLoading(true);
            try {
                const response = await axios.post('http://localhost:4000/create/copy', {
                    document_id: selectedDocumentId.document_id,
                    numCopies: numCopiesToAdd
                });
                console.log('Copies added successfully:', response.data);
                alert(`${numCopiesToAdd} copies added successfully!`);
                setNumCopiesToAdd(0);
                handleSearch();
            } catch (error) {
                console.error('Error adding copies:', error);
                alert('Failed to add copies. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please select a document and enter a valid number of copies to add.');
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
                                            <label htmlFor="numCopiesToAdd" className="form-label">Add Copies</label>
                                            <input type="number" id="numCopiesToAdd" name="numCopiesToAdd" value={numCopiesToAdd} onChange={handleAddCopiesInputChange} className="form-control" />
                                            <Button onClick={handleAddCopies} variant="success">Add Copies</Button>
                                            {addError && <p className="text-danger">{addError}</p>}
                                        </div>
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

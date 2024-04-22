import React, { useState } from 'react';

export default function SearchDocuments() {
    const [searchParams, setSearchParams] = useState({
        query: '',
        type: 'All'
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = async () => {
        
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header">
                    <h2 className="h4 font-weight-bold">Search Documents</h2>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="query" className="form-label">Search Query</label>
                        <input type="text" id="query" name="query" value={searchParams.query} onChange={handleInputChange} className="form-control" placeholder="Enter title, author, or ISBN" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">Document Type</label>
                        <select id="type" name="type" value={searchParams.type} onChange={handleInputChange} className="form-control">
                            <option>All</option>
                            <option>Book</option>
                            <option>Magazine</option>
                            <option>Journal Article</option>
                        </select>
                    </div>
                    <button onClick={handleSearch} className="btn btn-primary">Search</button>
                    {loading && <p>Loading...</p>}
                    <div className="mt-4">
                        <h3>Results:</h3>
                        <ul className="list-group">
                            {results.map(result => (
                                <li key={result.id} className="list-group-item">
                                    <strong>{result.title}</strong> by {result.authors} ({result.year})
                                    <span className="float-right">ISBN: {result.isbn}</span>
                                </li>
                            ))}
                        </ul>
                        {!loading && results.length === 0 && <p>No documents found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

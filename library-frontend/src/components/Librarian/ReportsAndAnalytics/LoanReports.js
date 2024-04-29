import React, { useState, useEffect } from 'react';
import axios from 'axios';

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

export default function LoanReports() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        setLoading(true);
        setError(null);
        try {
            // Send a GET request to the server
            // to fetch active loans
            // The server should respond with the active loans
            const response = await axios.get('http://localhost:4000/lendings/active-loans');  // Adjust endpoint as necessary
            setLoans(response.data.data.map(loan => ({
                ...loan,
                dueDate: formatDate(loan.return_date)  // Formatting due date for display
            })));
        } catch (error) {
            setError('Failed to load loans');
            console.error('Failed to fetch loans:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-lg h-100">
                <div className="card-header">
                    <h2 className="h4 font-weight-bold">Loan Reports</h2>
                </div>
                <div className="card-body">
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-danger">{error}</p>}
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Document Title</th>
                                <th>Client Email</th>
                                <th>Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map(loan => (
                                <tr key={loan.lending_id}>
                                    <td>{loan.title}</td>
                                    <td>{loan.client_email}</td>
                                    <td>{loan.dueDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

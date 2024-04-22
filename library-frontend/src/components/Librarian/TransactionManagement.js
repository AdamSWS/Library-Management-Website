import React, { useState } from 'react';

export default function TransactionManagement() {
    const [loans, setLoans] = useState([]);
    const [selectedLoanId, setSelectedLoanId] = useState(null);

    const handleReturn = () => {
        if (!selectedLoanId) return;
        const updatedLoans = loans.map(loan => loan.id === selectedLoanId ? { ...loan, isReturned: true, fee: 0 } : loan);
        setLoans(updatedLoans);
        alert(`Document returned successfully: ${selectedLoanId}`);
    };

    const handlePayFee = () => {
        if (!selectedLoanId) return;
        const updatedLoans = loans.map(loan => loan.id === selectedLoanId && loan.isOverdue ? { ...loan, fee: 0 } : loan);
        setLoans(updatedLoans);
        alert(`Overdue fee paid for document ${selectedLoanId}`);
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-lg h-100">
                <div className="card-header">
                    <h2 className="h4 font-weight-bold">Transaction Management</h2>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <button onClick={handleReturn} disabled={!selectedLoanId || loans.find(loan => loan.id === selectedLoanId)?.isReturned} className="btn btn-success mr-2">Return Selected</button>
                        <button onClick={handlePayFee} disabled={!selectedLoanId || !loans.find(loan => loan.id === selectedLoanId)?.isOverdue} className="btn btn-danger">Pay Fee for Selected</button>
                    </div>
                    <h3 className="text-lg font-semibold mb-3">Active Loans</h3>
                    <div style={{ overflowY: 'auto', height: '300px' }}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Document ID</th>
                                    <th>Title</th>
                                    <th>Client</th>
                                    <th>Due Date</th>
                                    <th>Overdue Fee</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.map((loan) => (
                                    <tr key={loan.id} onClick={() => setSelectedLoanId(loan.id)} className={selectedLoanId === loan.id ? "table-primary" : ""}>
                                        <td>{loan.id}</td>
                                        <td>{loan.title}</td>
                                        <td>{loan.client}</td>
                                        <td>{loan.dueDate}</td>
                                        <td>${loan.fee}</td>
                                        <td>{loan.isReturned ? <span className="text-success">Returned</span> : "Active"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

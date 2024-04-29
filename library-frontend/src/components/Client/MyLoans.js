import React, { useState, useEffect } from 'react';
import axios from 'axios';

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function calculateOverdueFee(returnDate, isOverdue) {
    const today = new Date();
    const dueDate = new Date(returnDate);
    if (!isOverdue) {
        return 0;
    }
    const diffTime = Math.max(0, today - dueDate);
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return 5 + 5 * diffWeeks; // Base fee + incremental fee per overdue week
}


export default function MyLoans({ user }) {
    const [loans, setLoans] = useState([]);
    const [selectedLoanId, setSelectedLoanId] = useState(null);

    useEffect(() => {
        if (user?.email) {
            fetchLoans();
        }
    }, [user]);

    useEffect(() => {
        if (user?.email) {
            fetchLoans();
        }
    }, [user]);

    const checkForCard = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/client/${user.email}/hasCard`);
            return response.data.hasCard;
        } catch (error) {
            console.error('Error checking for card:', error);
            alert('Failed to check for card. Please try again later.');
            return false;
        }
    };
    
    const fetchLoans = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/lendings/${user.email}`);
            const loanData = response.data.data.map(loan => ({
                ...loan,
                isReturned: false,
                fee: calculateOverdueFee(loan.return_date, loan.is_overdue)
            }));
            setLoans(loanData);
        } catch (error) {
            console.error('Failed to fetch loans:', error);
        }
    };
    

    const handleReturn = async () => {
        if (!selectedLoanId) return;
        try {
            const response = await axios.delete(`http://localhost:4000/delete/lending/${selectedLoanId}`);
            if (response.data.success) {
                const updatedLoans = loans.filter(loan => loan.lending_id !== selectedLoanId);
                setLoans(updatedLoans);
                alert('Loan returned successfully!');
            } else {
                alert('Failed to return the loan.');
            }
        } catch (error) {
            console.error('Failed to return the loan:', error);
            alert('Failed to return the loan. Please try again later.');
        }
    };

    const handlePayFee = async () => {
        if (!selectedLoanId) return;
    
        const hasCard = await checkForCard();
        if (!hasCard) {
            alert('No registered payment method found. Please add a card first.');
            return;
        }
    
        const updatedLoans = loans.map(loan => loan.lending_id === selectedLoanId ? { ...loan, fee: 0 } : loan);
        setLoans(updatedLoans);
        alert('Fee paid successfully!');
    };
    

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-lg h-100">
                <div className="card-header">
                    <h2 className="h4 font-weight-bold">My Loans</h2>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <button onClick={handleReturn} disabled={!selectedLoanId || loans.find(loan => loan.lending_id === selectedLoanId)?.isReturned} className="btn btn-success mr-2">Return Selected</button>
                        <button onClick={handlePayFee} disabled={!selectedLoanId || loans.find(loan => loan.lending_id === selectedLoanId)?.fee === 0} className="btn btn-danger">Pay Fee for Selected</button>
                    </div>
                    <h3 className="text-lg font-semibold mb-3">Active Loans</h3>
                    <div style={{ overflowY: 'auto', height: '300px' }}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Document ID</th>
                                    <th>Title</th>
                                    <th>Due Date</th>
                                    <th>Overdue Fee</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.length > 0 ? loans.map((loan) => (
                                    <tr key={loan.lending_id} onClick={() => setSelectedLoanId(loan.lending_id)} className={selectedLoanId === loan.lending_id ? "table-primary" : ""}>
                                        <td>{loan.copy_id}</td>
                                        <td>{loan.title}</td>
                                        <td>{formatDate(loan.return_date)}</td>
                                        <td>${loan.fee}</td>
                                        <td>{loan.isReturned ? <span className="text-success">Returned</span> : "Active"}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No current loans</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

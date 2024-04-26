import React, { useState } from 'react';

export default function MyLoans({preferredPaymentMethod}) {
    const [loans, setLoans] = useState([
        { id: 1, title: "Harry Potter and the Sorcerer's Stone", dueDate: "2024-04-28", isReturned: false },
        { id: 2, title: "Hunger Games", dueDate: "2024-03-25", isReturned: false }
    ]);
    const [selectedLoanIds, setSelectedLoanIds] = useState([]);
    const payMethod = preferredPaymentMethod;
    const calculateFee = (dueDate) => {
        const currentDate = new Date();
        const due = new Date(dueDate);
        const differenceInDays = Math.floor((currentDate - due) / (1000 * 60 * 60 * 24));
        const differenceInWeeks = Math.floor((currentDate - due) / (1000 * 60 * 60 * 24 * 7));
        const fee = differenceInWeeks > 0 ? differenceInWeeks * 5 + 5 : 0;
        const fee2 = differenceInDays > 0 ? 5 : 0;
        if (fee2 > 0 && fee === 0) {
            return fee2;
        }
        else {
            return fee;
        }
    };

    const handleCheckboxChange = (loanId) => {
        if (loans.find(loan => loan.id === loanId).isReturned) return;
        if (selectedLoanIds.includes(loanId)) {
            setSelectedLoanIds(selectedLoanIds.filter(id => id !== loanId));
        } else {
            setSelectedLoanIds([...selectedLoanIds, loanId]);
        }
    };

    const handleReturnSelected = () => {
        const confirmed = window.confirm("Are you sure you want to return the selected items?");
        if (confirmed) {
            const updatedLoans = loans.map(loan => selectedLoanIds.includes(loan.id) ? { ...loan, isReturned: true, fee: 0 } : loan);
            setLoans(updatedLoans);
            setSelectedLoanIds([]);
            const selectedTitles = selectedLoanIds.map(id => loans.find(item => item.id === id).title);
            alert(`Returned: ${selectedTitles.join(', ')}.`);
        }
    };

    const handlePayFeeForSelected = () => {
        const confirmed = window.confirm("Pay with selected card: " + payMethod + "?");
        if (confirmed) {
            const updatedLoans = loans.map(loan => selectedLoanIds.includes(loan.id) ? { ...loan, fee: 0, isReturned: true } : loan);
            setLoans(updatedLoans);
            setSelectedLoanIds([]);
            const selectedTitles = selectedLoanIds.map(id => loans.find(item => item.id === id).title);
            const totalFee = selectedLoanIds.reduce((total, id) => total + calculateFee(loans.find(item => item.id === id).dueDate), 0);
            alert(`Fees paid for: ${selectedTitles.join(', ')}. Total Fee: $${totalFee}`);
        }
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-lg h-100">
                <div className="card-header">
                    <h2 className="h4 font-weight-bold">My Loans</h2>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <button onClick={handleReturnSelected} disabled={selectedLoanIds.length === 0 || selectedLoanIds.some(id => new Date(loans.find(loan => loan.id === id).dueDate) < new Date() && !loans.find(loan => loan.id === id).isReturned)} className="btn btn-success mr-2">Return Selected</button>
                        <button onClick={handlePayFeeForSelected} disabled={selectedLoanIds.length === 0 || selectedLoanIds.some(id => new Date(loans.find(loan => loan.id === id).dueDate) >= new Date() || loans.find(loan => loan.id === id).isReturned)} className="btn btn-danger">Pay Fee for Selected</button>
                    </div>
                    <h3 className="text-lg font-semibold mb-3">Active Loans</h3>
                    <div style={{ overflowY: 'auto', height: '300px' }}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Document ID</th>
                                    <th>Title</th>
                                    <th>Due Date</th>
                                    <th>Overdue Fee</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.map((loan) => (
                                    <tr key={loan.id} className={loan.isReturned ? "table-secondary" : (selectedLoanIds.includes(loan.id) ? "table-primary" : "")}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleCheckboxChange(loan.id)}
                                                checked={selectedLoanIds.includes(loan.id)}
                                                disabled={loan.isReturned}
                                            />
                                        </td>
                                        <td>{loan.id}</td>
                                        <td>{loan.title}</td>
                                        <td>{loan.dueDate}</td>
                                        <td>{loan.isReturned ? "N/A" : (calculateFee(loan.dueDate) === 0 ? "N/A" : "$" + calculateFee(loan.dueDate))}</td>
                                        <td>{loan.isReturned ? <span className="text-success">Returned</span> : (!loan.isReturned && new Date(loan.dueDate) < new Date() ? <span className="text-danger">Overdue</span> : "Active")}</td>
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
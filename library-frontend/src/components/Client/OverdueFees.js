import React, { useState } from 'react';

export default function OverdueFees({preferredPaymentMethod}) {
    const [overdueItems, setOverdueItems] = useState([
        { id: 1, title: "To Kill a Mockingbird", dueDate: "2024-04-25" },
        { id: 2, title: "Hunger Games", dueDate: "2024-03-25" }
    ]);
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const payMethod = preferredPaymentMethod;
    const handleCheckboxChange = (itemId) => {
        if (selectedItemIds.includes(itemId)) {
            setSelectedItemIds(selectedItemIds.filter(id => id !== itemId));
        } else {
            setSelectedItemIds([...selectedItemIds, itemId]);
        }
    };

    const calculateFee = (dueDate) => {
        const currentDate = new Date();
        const due = new Date(dueDate);
        const differenceInDays = Math.floor((currentDate - due) / (1000 * 60 * 60 * 24));
        const differenceInWeeks = Math.floor((currentDate - due) / (1000 * 60 * 60 * 24 * 7));
        const fee = differenceInWeeks > 0 ? differenceInWeeks * 5 + 5 : 0;
        const fee2 = differenceInDays > 0 ? 5 : 0;
        if (fee2 > 0 && fee == 0) {
            return fee2;
        }
        else {
            return fee;
        }
    };

    const handlePayFee = () => {
        if (selectedItemIds.length === 0) return;

        const confirmed = window.confirm("Pay with selected card: " + payMethod + "?");
        if (!confirmed) return;

        const updatedItems = overdueItems.filter(item => !selectedItemIds.includes(item.id));
        setOverdueItems(updatedItems);
        const selectedTitles = selectedItemIds.map(id => overdueItems.find(item => item.id === id).title);
        const totalFee = selectedItemIds.reduce((total, id) => total + calculateFee(overdueItems.find(item => item.id === id).dueDate), 0);
        alert(`Fees paid for: ${selectedTitles.join(', ')}. Total Fee: $${totalFee}`);
        setSelectedItemIds([]);
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-lg">
                <div className="card-header">
                    <h2 className="h4 font-weight-bold">Overdue Fees</h2>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <button onClick={handlePayFee} disabled={selectedItemIds.length === 0} className="btn btn-danger">Pay Fee for Selected</button>
                    </div>
                    {overdueItems.length > 0 ? (
                        <div style={{ overflowY: 'auto', height: '300px' }}>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Select</th>
                                        <th>Title</th>
                                        <th>Due Date</th>
                                        <th>Fee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {overdueItems.map((item) => (
                                        <tr key={item.id} className={selectedItemIds.includes(item.id) ? "table-primary" : ""}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    onChange={() => handleCheckboxChange(item.id)}
                                                    checked={selectedItemIds.includes(item.id)}
                                                />
                                            </td>
                                            <td>{item.title}</td>
                                            <td>{item.dueDate}</td>
                                            <td>${calculateFee(item.dueDate)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center">No overdue fees.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

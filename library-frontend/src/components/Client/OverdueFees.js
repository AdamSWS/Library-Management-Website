import React, { useState } from 'react';

export default function OverdueFees() {
    const [overdueItems, setOverdueItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const handlePayFee = () => {
        if (!selectedItemId) return;
        setOverdueItems(overdueItems.filter(item => item.id !== selectedItemId));
        alert(`Fee paid for document ID: ${selectedItemId}`);
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-lg">
            <div className="card-header">
                    <h2 className="h4 font-weight-bold">Overdue Fees</h2>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <button onClick={handlePayFee} disabled={!selectedItemId} className="btn btn-danger">Pay Fee for Selected</button>
                    </div>
                    {overdueItems.length > 0 ? (
                        <div style={{ overflowY: 'auto', height: '300px' }}>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Due Date</th>
                                        <th>Fee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {overdueItems.map((item) => (
                                        <tr key={item.id} onClick={() => setSelectedItemId(item.id)} className={selectedItemId === item.id ? "table-primary" : ""}>
                                            <td>{item.title}</td>
                                            <td>{item.dueDate}</td>
                                            <td>${item.fee}</td>
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

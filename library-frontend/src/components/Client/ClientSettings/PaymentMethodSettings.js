import React from 'react';

function PaymentMethodSettings({ methods, onUpdate }) {
    const handleDelete = (id) => {
        onUpdate(methods.filter(m => m.id !== id));
    };

    const handleAdd = () => {
        const newMethod = { id: Date.now(), cardNumber: prompt('Enter card number'), expiry: prompt('Enter expiry date') };
        onUpdate([...methods, newMethod]);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Payment Methods</h2>
            {methods.map(method => (
                <div key={method.id} className="flex items-center space-x-3 mb-2">
                    <span className="flex-auto">{method.cardNumber} (Exp: {method.expiry})</span>
                    <button onClick={() => handleDelete(method.id)} className="btn btn-danger">Delete</button>
                </div>
            ))}
            <button onClick={handleAdd} className="btn btn-primary">Add New Method</button>
        </div>
    );
}

export default PaymentMethodSettings;

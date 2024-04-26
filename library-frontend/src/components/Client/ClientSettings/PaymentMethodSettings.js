import React, { useState, useEffect } from 'react';

function PaymentMethodSettings({ methods, onUpdate, preferredPaymentMethod, setPreferredPaymentMethod }) {
    const [initialRender, setInitialRender] = useState(true);

    useEffect(() => {
        // After initial render, setInitialRender to false
        setInitialRender(false);
    }, []);

    const handleDelete = (id) => {
        onUpdate(methods.filter(m => m.id !== id));
    };

    const handleAdd = () => {
        const newMethod = { id: Date.now(), cardNumber: prompt('Enter card number'), expiry: prompt('Enter expiry date') };
        onUpdate([...methods, newMethod]);
    };

    const handleSetPreferredPaymentMethod = (method) => {
        const confirmed = window.confirm("Are you sure you want to update your preferred payment method?");
        if (confirmed) {
            alert(`Primary payment method updated to ` + method.cardNumber);
            setPreferredPaymentMethod(method.cardNumber);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Payment Methods</h2>
            {methods.map((method, index) => (
                <div key={method.id} className="flex items-center space-x-3 mb-2">
                    <span className="flex-auto">{method.cardNumber} (Exp: {method.expiry})</span>
                    {initialRender && index === 0 ? (
                        <button className="btn btn-secondary" disabled>Primary Payment</button>
                    ) : (
                        preferredPaymentMethod === method.cardNumber ? (
                            <button className="btn btn-secondary" disabled>Primary Payment</button>
                        ) : (
                            <button onClick={() => handleSetPreferredPaymentMethod(method)} className="btn btn-primary">Primary Payment</button>
                        )
                    )}
                    <button onClick={() => handleDelete(method.id)} className="btn btn-danger">Delete</button>
                </div>
            ))}
            <button onClick={handleAdd} className="btn btn-primary">Add New Method</button>
        </div>
    );
}

export default PaymentMethodSettings;
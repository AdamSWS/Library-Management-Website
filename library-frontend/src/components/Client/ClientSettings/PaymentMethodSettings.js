import React, { useState } from 'react';

function PaymentMethodSettings({ methods, onUpdate, preferredPaymentMethod, setPreferredPaymentMethod }) {
    const [initialPrimaryPressed, setInitialPrimaryPressed] = useState(false);

    const handleDelete = (id) => {
        onUpdate(methods.filter(m => m.id !== id));
    };

function PaymentDialog({ isOpen, setIsOpen, addMethod, userEmail, addresses }) {
    const [cardNumber, setCardNumber] = useState('');
    const [addressId, setAddressId] = useState('');

    const handleSave = async () => {
        if (cardNumber.trim() && addressId) {
            try {
                const response = await fetch('http://localhost:4000/client/addPayment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        cardNumber,
                        email: userEmail,
                        address_id: addressId
                    })
                });
                if (response.ok) {
                    const newMethod = await response.json();
                    addMethod(newMethod.data);  // Assume newMethod.data is an object
                    console.log('New payment method added:', newMethod);
                    setCardNumber('');
                    setAddressId('');
                    setIsOpen(false);
                } else {
                    throw new Error('Failed to add payment method');
                }
            } catch (error) {
                console.error('Error adding payment method:', error);
                alert('Failed to add payment method. Please try again.');
            }
        }
    };

    const handleSetPreferredPaymentMethod = (method) => {
        const confirmed = window.confirm("Are you sure you want to update your preferred payment method?");
        if (confirmed) {
            if (!initialPrimaryPressed) {
                setInitialPrimaryPressed(true);
            }
            setPreferredPaymentMethod(method.cardNumber);
            alert(`Primary payment method updated to ${method.cardNumber}`);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Payment Methods</h2>
            {methods.map((method, index) => (
                <div key={method.id} className="flex items-center space-x-3 mb-2">
                    <span className="flex-auto">{method.cardNumber} (Exp: {method.expiry})</span>
                    {(index === 0 && !initialPrimaryPressed) || preferredPaymentMethod === method.cardNumber ? (
                        <button className="btn btn-secondary" disabled>Primary Payment</button>
                    ) : (
                        <button onClick={() => handleSetPreferredPaymentMethod(method)} className="btn btn-primary">Primary Payment</button>
                    )}
                    <button onClick={() => handleDelete(method.id)} className="btn btn-danger">Delete</button>
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Add Payment Method</h2>
                <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="form-control mb-3" placeholder="Enter Card Number" />
                <select value={addressId} onChange={e => setAddressId(e.target.value)} className="form-control mb-3">
                    <option value="">Select Address</option>
                    {addresses.map(address => (
                        <option key={address.id} value={address.id}>{address.address}</option>
                    ))}
                </select>
                <div className="flex justify-end">
                    <button onClick={() => setIsOpen(false)} className="btn btn-danger">Cancel</button>
                    <div className="w-4"></div>
                    <button onClick={handleSave} className="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    );
}

export default PaymentMethodSettings;
function PaymentMethodSettings({ methods, onUpdate, userEmail, addresses }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = (cardNumber) => {
        console.log('Deleting method with ID:', cardNumber);
        const deleteMethod = async () => {
            try {
                const response = await fetch('http://localhost:4000/client/deletePayment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cardNumber: cardNumber, email: userEmail })  // Ensure you're sending the correct identifier to delete
                });
                if (response.ok) {
                    console.log(methods);
                    const updatedPayment = methods.filter(method => method.cardnumber !== cardNumber);
                    console.log('Updated payment methods after delete:', updatedPayment);
                    onUpdate(updatedPayment);
                } else {
                    throw new Error('Failed to delete payment method');
                }
            } catch (error) {
                console.error('Error deleting payment method:', error);
                alert('Failed to delete payment method. Please try again.');
            }
        };
        deleteMethod();
    };

    const handleAdd = (newMethod) => {
        if (newMethod) {
            onUpdate([...methods, ...newMethod]);  // Ensure newMethod is an object and added correctly
        }
    };

    function maskCardNumber(cardNumber) {
        if (!cardNumber || cardNumber.length < 4) {
            return cardNumber; // Return as is or handle it as you see fit (e.g., return 'Invalid number')
        }
        return cardNumber.slice(0, -4).replace(/./g, '*') + cardNumber.slice(-4);
    }
    

    return (
        <>
            <PaymentDialog isOpen={isOpen} setIsOpen={setIsOpen} addMethod={handleAdd} userEmail={userEmail} addresses={addresses} />
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Payment Methods</h2>
                {methods.map(method => (
                    <div key={method.id} className="flex items-center space-x-3 mb-2">
                        <span className="flex-auto">{maskCardNumber(method.cardnumber)} (Address: {method.address})</span>
                        <button onClick={() => handleDelete(method.cardnumber)} className="btn btn-danger">Delete</button>
                    </div>
                ))}
                <button onClick={() => setIsOpen(true)} className="btn btn-primary">Add New Method</button>
            </div>
        </>
    );
}

export default PaymentMethodSettings;

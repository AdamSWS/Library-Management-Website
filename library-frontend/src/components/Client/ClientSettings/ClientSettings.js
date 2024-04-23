import React, { useState } from 'react';
import PersonalClientSettings from './PersonalClientSettings';
import PaymentMethodSettings from './PaymentMethodSettings';

export default function ClientSettings() {
    const [clientInfo, setClientInfo] = useState({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        addresses: ['1234 Broadway St', '5678 Market St']
    });

    const [paymentMethods, setPaymentMethods] = useState([
        { id: 1, cardNumber: '**** **** **** 1234', expiry: '08/24' },
        { id: 2, cardNumber: '**** **** **** 5678', expiry: '10/25' }
    ]);

    return (
        <div className="container mx-auto mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PersonalClientSettings settings={clientInfo} onSave={setClientInfo} />
                <PaymentMethodSettings methods={paymentMethods} onUpdate={setPaymentMethods} />
            </div>
        </div>
    );
}
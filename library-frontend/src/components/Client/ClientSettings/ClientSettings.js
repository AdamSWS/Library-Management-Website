import React, { useState, useEffect } from 'react';
import PersonalClientSettings from './PersonalClientSettings';
import PaymentMethodSettings from './PaymentMethodSettings';
import ClientAddresses from './ClientAddresses';
import OverdueFees from '../OverdueFees';
import MyLoans from '../MyLoans';

export default function ClientSettings() {
    const [clientInfo, setClientInfo] = useState({
        name: 'Jane Doe',
        email: 'zyx@gmail.com',
        addresses: [],
        paymentMethods: []
    });

    async function fetchAddresses(userEmail) {
        try {
            const response = await fetch(`http://localhost:4000/client/addresses/${userEmail}`);
            const data = await response.json();
            if (response.ok) {
                setClientInfo(clientInfo => ({ ...clientInfo, addresses: data.data }));
                console.log('Addresses:', data.data);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    }

    async function fetchPaymentMethods(userEmail) {
        try {
            const response = await fetch(`http://localhost:4000/client/payments/${userEmail}`);
            const data = await response.json();
            if (response.ok) {
                setClientInfo(clientInfo => ({ ...clientInfo, paymentMethods: data.data }));
                console.log('Payment Methods:', data.data);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        }
    }
    
    // fetch payment methods when loading the component
    // fetch addresses when loading the component

    // Use separate useEffect hooks to handle fetching addresses and payment methods independently
    useEffect(() => {
        if (clientInfo.email) {
            fetchAddresses(clientInfo.email);
        }
    }, [clientInfo.email]); // Dependency on clientInfo.email to re-fetch if it changes

    useEffect(() => {
        if (clientInfo.email) {
            fetchPaymentMethods(clientInfo.email);
        }
    }, [clientInfo.email]); // Similarly, dependent on clientInfo.email



    // console.log('Client Info:', clientInfo);

    

    return (
        <div className="container mx-auto mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PersonalClientSettings settings={clientInfo} onSave={setClientInfo} />
                <PaymentMethodSettings methods={clientInfo.paymentMethods} userEmail={clientInfo.email} addresses={clientInfo.addresses} onUpdate={(paymentMethods) => setClientInfo({ ...clientInfo, paymentMethods })} />
                <ClientAddresses addresses={clientInfo.addresses} userEmail={clientInfo.email} onUpdate={(addresses)  => setClientInfo({ ...clientInfo, addresses })} />
                <OverdueFees preferredPaymentMethod={preferredPaymentMethod} />
                <MyLoans preferredPaymentMethod={preferredPaymentMethod} />
            </div>
        </div>
    );
}

export { ClientSettings };
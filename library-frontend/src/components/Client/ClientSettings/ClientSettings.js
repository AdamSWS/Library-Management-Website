import React, { useState, useEffect } from 'react';
import PersonalClientSettings from './PersonalClientSettings';
import PaymentMethodSettings from './PaymentMethodSettings';

export default function ClientSettings({ user }) {

    return (
        <div className="container mx-auto mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PersonalClientSettings user={user}/>
                <PaymentMethodSettings email={user.email} />
            </div>
        </div>
    );
}

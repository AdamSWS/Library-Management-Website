import React, { useState } from 'react';
import SearchDocuments from './SearchDocument/SearchDocuments';
import MyLoans from './MyLoans';
import ClientSettings from './ClientSettings/ClientSettings';

export default function ClientDashboard({ user }) {
    const [activeTab, setActiveTab] = useState('search');

    const getComponent = () => {
        switch (activeTab) {
            case 'search':
                return <SearchDocuments user={ user } />;
            case 'loans':
                return <MyLoans user={ user } />;
            case 'settings':
                return <ClientSettings user={ user } />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="container mx-auto mt-5">
            <div className="bg-blue-800 text-white text-3xl font-bold text-center mb-5 py-3 shadow-md">
                Client Dashboard
            </div>
            <div className="flex justify-center space-x-4 mb-4 bg-gray-100 py-2 px-4 rounded-lg shadow-inner">
                <button onClick={() => setActiveTab('search')} className={`flex-1 py-2 rounded ${activeTab === 'search' ? 'bg-blue-500 text-white' : 'text-blue-500 bg-transparent'}`}>Search Documents</button>
                <button onClick={() => setActiveTab('loans')} className={`flex-1 py-2 rounded ${activeTab === 'loans' ? 'bg-blue-500 text-white' : 'text-blue-500 bg-transparent'}`}>My Loans</button>
                <button onClick={() => setActiveTab('settings')} className={`flex-1 py-2 rounded ${activeTab === 'settings' ? 'bg-blue-500 text-white' : 'text-blue-500 bg-transparent'}`}>Settings</button>
            </div>
            <div className="flex justify-center">
                {getComponent()}
            </div>
        </div>
    );
}

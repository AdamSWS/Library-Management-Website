import React, { useState } from 'react';
import DocumentManagement from './DocumentManagement/DocumentManagement';
import ClientManagement from './ClientManagement/ClientManagement';
import TransactionManagement from './TransactionManagement';
import SearchDocuments from './SearchDocuments';
import Reports from './ReportsAndAnalytics/Reports';
import Notifications from './Notifications';
import Settings from './Settings/Settings';

export default function LibrarianDashboard() {
    const [activeTab, setActiveTab] = useState('document');

    const getComponent = () => {
        switch (activeTab) {
            case 'document':
                return <DocumentManagement />;
            case 'client':
                return <ClientManagement />;
            case 'transaction':
                return <TransactionManagement />;
            case 'search':
                return <SearchDocuments />;
            case 'reports':
                return <Reports />;
            case 'notifications':
                return <Notifications />;
            case 'settings':
                return <Settings />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="container mx-auto mt-5">
            <div className="bg-blue-800 text-white text-3xl font-bold text-center mb-5 py-3 shadow-md">
                Librarian Dashboard
            </div>
            <div className="flex justify-center space-x-4 mb-4 bg-gray-100 py-2 px-4 rounded-lg shadow-inner">
                <button onClick={() => setActiveTab('document')} className={`flex-1 py-2 rounded ${activeTab === 'document' ? 'bg-blue-500 text-white' : 'text-blue-500 bg-transparent'}`}>Document Management</button>
                <button onClick={() => setActiveTab('client')} className={`flex-1 py-2 rounded ${activeTab === 'client' ? 'bg-blue-500 text-white' : 'text-blue-500 bg-transparent'}`}>Client Management</button>
                <button onClick={() => setActiveTab('transaction')} className={`flex-1 py-2 rounded ${activeTab === 'transaction' ? 'bg-blue-500 text-white' : 'text-blue-500 bg-transparent'}`}>Transaction Management</button>
                <button onClick={() => setActiveTab('search')} className={`flex-1 py-2 rounded ${activeTab === 'search' ? 'bg-blue-500 text-white' : 'text-blue-500 bg-transparent'}`}>Search Documents</button>
                <button onClick={() => setActiveTab('reports')} className={`flex-1 py-2 rounded ${activeTab === 'reports' ? 'bg-blue-500 text-white' : 'text-blue-500 bg-transparent'}`}>Reports and Analytics</button>
                <button onClick={() => setActiveTab('notifications')} className={`flex-1 py-2 rounded ${activeTab === 'notifications' ? 'bg-blue-500 text-white' : 'text-blue-500 bg-transparent'}`}>Notifications and Alerts</button>
                <button onClick={() => setActiveTab('settings')} className={`flex-1 py-2 rounded ${activeTab === 'settings' ? 'bg-blue-500 text-white' : 'text-blue-500 bg-transparent'}`}>Settings</button>
            </div>
            <div className="flex justify-center">
                {getComponent()}
            </div>
        </div>
    );
}

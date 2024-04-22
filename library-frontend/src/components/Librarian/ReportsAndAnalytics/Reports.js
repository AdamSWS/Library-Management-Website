import React, { useState } from 'react';
import LoanReports from './LoanReports';
import OverdueReports from './OverdueReports';
import InventoryReports from './InventoryReports';

export default function Reports() {
    const [currentTab, setCurrentTab] = useState('loans');
    const [reportData, setReportData] = useState({
        loans: [],
        overdues: [],
        inventory: []
    });

    const fetchReports = () => {

    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-header">
                    <h2 className="h4 font-weight-bold">Library Reports</h2>
                </div>
                <div className="card-body">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className={`nav-link ${currentTab === 'loans' ? 'active' : ''}`} onClick={() => setCurrentTab('loans')}>Loan Reports</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${currentTab === 'overdues' ? 'active' : ''}`} onClick={() => setCurrentTab('overdues')}>Overdue Reports</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${currentTab === 'inventory' ? 'active' : ''}`} onClick={() => setCurrentTab('inventory')}>Inventory Reports</a>
                        </li>
                    </ul>

                    <div className="tab-content mt-4">
                        {currentTab === 'loans' && <LoanReports loans={reportData.loans} />}
                        {currentTab === 'overdues' && <OverdueReports overdues={reportData.overdues} />}
                        {currentTab === 'inventory' && <InventoryReports inventory={reportData.inventory} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

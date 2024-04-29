import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InventoryReports() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/inventory');
            setInventory(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
            setError('Failed to load inventory');
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-lg h-100">
                <div className="card-header">
                    <h2 className="h4 font-weight-bold">Inventory Reports</h2>
                </div>
                <div className="card-body">
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-danger">{error}</p>}
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Document Title</th>
                                <th>Copies Available</th>
                                <th>Copies Loaned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item.document_id}>
                                    <td>{item.documentTitle}</td>
                                    <td>{item.copiesAvailable}</td>
                                    <td>{item.copiesLoaned}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default InventoryReports;

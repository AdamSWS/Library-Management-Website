import React, { useState } from 'react';
import axios from 'axios';

export default function Settings({ user }) {
    const [formData, setFormData] = useState({
        ssn: user.ssn || '',
        name: user.name || '',
        email: user.email || '',
        salary: user.salary || ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/update/librarian', formData);
            alert('Librarian details updated successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('Failed to update librarian details:', error);
            alert('Failed to update details. Please try again.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="text-2xl font-semibold mb-5">Librarian Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-6 ">
                {Object.entries(formData).map(([key, value]) => (
                    <div className="flex items-center space-x-4" key={key}>
                        <label htmlFor={key} className="flex-none w-32 text-right font-bold text-lg">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                        <input
                            type={key === 'salary' ? 'number' : 'text'}
                            id={key}
                            name={key}
                            value={value}
                            onChange={handleChange}
                            className="form-control flex-auto text-lg py-2 px-4"
                            required
                            style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                            step={key === 'salary' ? '0.01' : undefined}
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-primary w-full py-3 text-xl">Save Changes</button>
            </form>
        </div>
    );
}

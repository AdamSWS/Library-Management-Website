import React, { useState } from 'react';
import axios from 'axios';

// componet that displays client settings
function PersonalClientSettings({ user, onSave }) {
    const [formData, setFormData] = useState(user);

    // hanldes changes to personal information
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // handles submission of personal infomation to database
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                currentEmail: user.email,
                newEmail: formData.newEmail,
                name: formData.name,
            };

            const response = await axios.post('http://localhost:4000/update/client', updateData);
            if (response.data.success) {
                alert('Client updated successfully');
            } else {
                alert('Failed to update client');
            }
        } catch (error) {
            console.error('Error updating client:', error);
            alert('Failed to update client: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Personal Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-3">
                    <label htmlFor="name" className="flex-none w-28 text-right font-bold">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-control flex-auto" required />
                </div>
                <div className="flex items-center space-x-3">
                    <label htmlFor="email" className="flex-none w-28 text-right font-bold">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control flex-auto" required />
                </div>
                <button type="submit" className="btn btn-primary w-full">Save Changes</button>
            </form>
        </div>
    );
}

export default PersonalClientSettings;

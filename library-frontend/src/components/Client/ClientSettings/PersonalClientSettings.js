import React, { useState } from 'react';

function PersonalClientSettings({ settings, onSave }) {
    const [formData, setFormData] = useState(settings);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(formData);
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

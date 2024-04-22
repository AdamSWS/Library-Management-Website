import React, { useState } from 'react';

function PersonalSettingsForm({ onSave, settings }) {
    const [formData, setFormData] = useState(settings);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Personal Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {Object.entries(formData).map(([key, value]) => (
                    <div className="flex items-center space-x-3" key={key}>
                        <label htmlFor={key} className="flex-none w-28 text-right font-bold">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                        <input
                            type="text"
                            id={key}
                            name={key}
                            value={value}
                            onChange={handleChange}
                            className="form-control flex-auto"
                            required
                        />
                    </div>
                ))}
                <button type="submit" className="btn btn-primary w-full">Save Changes</button>
            </form>
        </div>
    );
}

export default PersonalSettingsForm;

import React from 'react';

function RegisterClient({ formData, handleInputChange, handleSubmit }) {
    return (
        <div className="container mx-auto mt-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Client Management - Register Client</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    {["name", "email", "address", "creditCard"].map((field) => (
                        <div key={field} className="flex items-center space-x-3">
                            <label htmlFor={field} className="flex-none w-28 text-right font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type="text"
                                id={field}
                                name={field}
                                value={formData[field]}
                                onChange={handleInputChange}
                                className="form-control flex-auto"
                                placeholder={`Enter ${field}`}
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                        Register Client
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterClient;

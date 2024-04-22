import React from 'react';

function EditClient({ editFormData, handleInputChange, handleEdit }) {
    return (
        <div className="container mx-auto mt-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Client Management - Edit Client</h2>
                <form onSubmit={handleEdit} className="space-y-3">
                    {["name", "email", "address", "creditCard"].map((field) => (
                        <div key={field} className="flex items-center space-x-3">
                            <label htmlFor={`edit-${field}`} className="flex-none w-28 text-right font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type="text"
                                id={`edit-${field}`}
                                name={field}
                                value={editFormData[field]}
                                onChange={handleInputChange}
                                className="form-control flex-auto"
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                        Update Client
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditClient;

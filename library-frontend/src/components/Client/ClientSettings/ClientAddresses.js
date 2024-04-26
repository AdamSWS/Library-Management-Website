import React, { useState } from "react";

function AddressDialog({ isOpen, setIsOpen, addAddress, userEmail }) {
    const [address, setAddress] = useState('');

    const handleSave = async () => {
        if (address.trim()) {
            try {
                const response = await fetch('http://localhost:4000/client/addaddress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        address: address,
                        email: userEmail
                    })
                });

                if (response.ok) {
                    const newAddress = await response.json(); // Assuming the server responds with the added address
                    // console.log(newAddress); // Check the structure here
                    addAddress(newAddress.data); // Update local state with new address from server response
                    setAddress('');
                    setIsOpen(false);
                } else {
                    throw new Error('Failed to add address');
                }
            } catch (error) {
                console.error('Error adding address:', error);
                alert('Failed to add address. Please try again.');
            }
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Add Address</h2>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="form-control mb-3" placeholder="Enter Address" />
                <div className="flex justify-end">
                    <button onClick={() => setIsOpen(false)} className="btn btn-danger">Cancel</button>
                    <div className="w-4"></div>
                    <button onClick={handleSave} className="btn btn-primary">Save</button>
                </div>
            </div>
        </div>
    );
}


function ClientAddresses({ addresses, onUpdate, userEmail }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = (id,address) => {
        console.log('Deleting address with ID:', id);
        console.log('Current address:', address);
    
        const deleteAddress = async () => {
            try {
                const response = await fetch('http://localhost:4000/client/deleteaddress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ address: address, email: userEmail })
                });
                if (response.ok) {
                    const updatedAddresses = addresses.filter(a => a.id !== id);
                    console.log('Updated addresses after delete:', updatedAddresses);
                    onUpdate(updatedAddresses);
                } else {
                    throw new Error('Failed to delete address');
                }
            } catch (error) {
                console.error('Error deleting address:', error);
                alert('Failed to delete address. Please try again.');
            }
        }
        deleteAddress();
    };
    

    const handleAdd = (newAddress) => {
        onUpdate([...addresses, ...newAddress]); // Correct usage if new
        // reset the current addresses with the new ones
    };

    return (
        <>
            <AddressDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} addAddress={handleAdd} userEmail={userEmail} />
            <div className="bg-white p-3 rounded-lg shadow-lg">
                <div className="flex items-center mb-3">
                    <h2 className="text-xl font-semibold" style={{ flex: "0 0 50px" }}>Id</h2>
                    <h2 className="text-xl font-semibold" style={{ flex: "1" }}>Addresses</h2>
                </div>
                {addresses.map(address => (
                    <div key={address.id} className="flex items-center space-x-3 mb-2">
                        <span style={{ flex: "0 0 50px" }}>{addresses.indexOf(address)+1}</span>
                        <span style={{ flex: "1" }}>{address.address}</span>
                        <button onClick={() => handleDelete(address.id,address.address)} className="btn btn-danger">Delete</button>
                    </div>
                ))}
                <button onClick={() => setIsDialogOpen(true)} className="btn btn-primary">Add New Address</button>
            </div>
        </>
    );
}


export default ClientAddresses;

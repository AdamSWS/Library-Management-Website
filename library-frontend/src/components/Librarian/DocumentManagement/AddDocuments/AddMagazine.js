import React, { useState } from 'react';
import axios from 'axios';

export default function AddMagazine() {
    const [magazineData, setMagazineData] = useState({
        title: '',
        isbn: '',
        publisher: '',
        year: '',
        month: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMagazineData({ ...magazineData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/addmagazine', magazineData);
            console.log('Magazine added successfully:', response.data);
            alert('Magazine added successfully!');
        } catch (error) {
            console.error('Failed to add magazine:', error.response);
            alert('Failed to add magazine. Please try again!');
        }
    };

    return (
        <div className="container mx-auto mt-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Add New Magazine</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <label htmlFor="title" className="flex-none w-28 text-right font-bold">Title</label>
                        <input type="text" id="title" name="title" value={magazineData.title} onChange={handleChange} className="form-control flex-auto" placeholder="Enter title" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="isbn" className="flex-none w-28 text-right font-bold">ISBN</label>
                        <input type="text" id="isbn" name="isbn" value={magazineData.isbn} onChange={handleChange} className="form-control flex-auto" placeholder="ISBN number" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="publisher" className="flex-none w-28 text-right font-bold">Publisher</label>
                        <input type="text" id="publisher" name="publisher" value={magazineData.publisher} onChange={handleChange} className="form-control flex-auto" placeholder="Publisher name" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="year" className="flex-none w-28 text-right font-bold">Year</label>
                        <input type="text" id="year" name="year" value={magazineData.year} onChange={handleChange} className="form-control flex-auto" placeholder="Publication year" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="month" className="flex-none w-28 text-right font-bold">Month</label>
                        <input type="text" id="month" name="month" value={magazineData.month} onChange={handleChange} className="form-control flex-auto" placeholder="Month of issue" />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Add Magazine</button>
                </form>
            </div>
        </div>
    );
}

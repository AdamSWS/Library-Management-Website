import React, { useState } from 'react';
import axios from 'axios';

export default function AddBook() {
    const [bookData, setBookData] = useState({
        title: '',
        authors: '',
        isbn: '',
        publisher: '',
        year: '',
        edition: '',
        pages: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send a POST request to the server
            // to add a new book to the database
            const response = await axios.post('http://localhost:4000/addbook', bookData);
            if (response.data.success) {
                alert('Book added successfully');
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            alert('Failed to add book: ' + (error.response?.data?.message || error.message));
        }
    };
    return (
        <div className="container mx-auto mt-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Add New Book</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <label htmlFor="title" className="flex-none w-28 text-right font-bold">Title</label>
                        <input type="text" id="title" name="title" value={bookData.title} onChange={handleChange} className="form-control flex-auto" placeholder="Enter title" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="authors" className="flex-none w-28 text-right font-bold">Authors</label>
                        <input type="text" id="authors" name="authors" value={bookData.authors} onChange={handleChange} className="form-control flex-auto" placeholder="Author names" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="isbn" className="flex-none w-28 text-right font-bold">ISBN</label>
                        <input type="text" id="isbn" name="isbn" value={bookData.isbn} onChange={handleChange} className="form-control flex-auto" placeholder="ISBN number" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="publisher" className="flex-none w-28 text-right font-bold">Publisher</label>
                        <input type="text" id="publisher" name="publisher" value={bookData.publisher} onChange={handleChange} className="form-control flex-auto" placeholder="Publisher name" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="year" className="flex-none w-28 text-right font-bold">Year</label>
                        <input type="text" id="year" name="year" value={bookData.year} onChange={handleChange} className="form-control flex-auto" placeholder="Publication year" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="edition" className="flex-none w-28 text-right font-bold">Edition</label>
                        <input type="text" id="edition" name="edition" value={bookData.edition} onChange={handleChange} className="form-control flex-auto" placeholder="Edition number" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="pages" className="flex-none w-28 text-right font-bold">Pages</label>
                        <input type="text" id="pages" name="pages" value={bookData.pages} onChange={handleChange} className="form-control flex-auto" placeholder="Number of pages" />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Add Book</button>
                </form>
            </div>
        </div>
    );
}

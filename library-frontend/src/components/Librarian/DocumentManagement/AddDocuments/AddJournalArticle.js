import React, { useState } from 'react';

export default function AddJournalArticle() {
    const [journalData, setJournalData] = useState({
        title: '',
        authors: '',
        isbn: '',
        publisher: '',
        year: '',
        issue: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJournalData({ ...journalData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Journal Article Data:', journalData);
    };

    return (
        <div className="container mx-auto mt-4">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Add New Journal Article</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <label htmlFor="title" className="flex-none w-28 text-right font-bold">Title</label>
                        <input type="text" id="title" name="title" value={journalData.title} onChange={handleChange} className="form-control flex-auto" placeholder="Enter title" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="authors" className="flex-none w-28 text-right font-bold">Authors</label>
                        <input type="text" id="authors" name="authors" value={journalData.authors} onChange={handleChange} className="form-control flex-auto" placeholder="Author names" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="isbn" className="flex-none w-28 text-right font-bold">ISBN</label>
                        <input type="text" id="isbn" name="isbn" value={journalData.isbn} onChange={handleChange} className="form-control flex-auto" placeholder="ISBN number" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="publisher" className="flex-none w-28 text-right font-bold">Publisher</label>
                        <input type="text" id="publisher" name="publisher" value={journalData.publisher} onChange={handleChange} className="form-control flex-auto" placeholder="Publisher name" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="year" className="flex-none w-28 text-right font-bold">Year</label>
                        <input type="text" id="year" name="year" value={journalData.year} onChange={handleChange} className="form-control flex-auto" placeholder="Publication year" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="issue" className="flex-none w-28 text-right font-bold">Issue</label>
                        <input type="text" id="issue" name="issue" value={journalData.issue} onChange={handleChange} className="form-control flex-auto" placeholder="Issue number" />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Add Journal Article</button>
                </form>
            </div>
        </div>
    );
}

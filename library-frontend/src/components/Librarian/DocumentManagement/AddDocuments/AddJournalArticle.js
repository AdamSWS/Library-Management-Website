import React, { useState } from 'react';
import axios from 'axios';

export default function AddJournalArticle() {
    const [journalData, setJournalData] = useState({
        title: '',
        authors: '',
        journal_name: '',
        issue_number: '',
        article_number: '',
        year: '',
        publisher: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJournalData({ ...journalData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Journal Article Data:', journalData);
        try {
            const response = await axios.post('http://localhost:4000/addjournalarticle', journalData);
            alert('Journal Article added successfully');
            console.log('Server Response:', response.data);
        } catch (error) {
            alert('Failed to add journal article');
            console.error('Error:', error.response || error);
        }
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
                        <label htmlFor="journal_name" className="flex-none w-28 text-right font-bold">Journal Name</label>
                        <input type="text" id="journal_name" name="journal_name" value={journalData.journal_name} onChange={handleChange} className="form-control flex-auto" placeholder="Journal name" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="issue_number" className="flex-none w-28 text-right font-bold">Issue Number</label>
                        <input type="number" id="issue_number" name="issue_number" value={journalData.issue_number} onChange={handleChange} className="form-control flex-auto" placeholder="Issue number" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="article_number" className="flex-none w-28 text-right font-bold">Article Number</label>
                        <input type="number" id="article_number" name="article_number" value={journalData.article_number} onChange={handleChange} className="form-control flex-auto" placeholder="Article number" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="year" className="flex-none w-28 text-right font-bold">Year</label>
                        <input type="number" id="year" name="year" value={journalData.year} onChange={handleChange} className="form-control flex-auto" placeholder="Publication year" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <label htmlFor="publisher" className="flex-none w-28 text-right font-bold">Publisher</label>
                        <input type="text" id="publisher" name="publisher" value={journalData.publisher} onChange={handleChange} className="form-control flex-auto" placeholder="Publisher name" />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Add Journal Article</button>
                </form>
            </div>
        </div>
    );
}

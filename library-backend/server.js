const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./database');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/login/librarian', async (req, res) => {
    const { email, ssn } = req.body;
    try {
        const query = 'SELECT * FROM "Librarians" WHERE email = $1 AND ssn = $2';
        const result = await pool.query(query, [email, ssn]);
        if (result.rows.length > 0) {
            res.json({ success: true, message: "Login successful" });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post('/login/client', async (req, res) => {
    const { email } = req.body;
    try {
        const query = 'SELECT * FROM "Clients" WHERE email = $1';
        const result = await pool.query(query, [email]);
        if (result.rows.length > 0) {
            res.json({ success: true, message: "Login successful" });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post('/signup/librarian', async (req, res) => {
    console.log(req.body);
    const { ssn, name, email, salary } = req.body;
    if (!(email && name && ssn && salary)) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const existsQuery = 'SELECT * FROM "Librarians" WHERE email = $1 OR ssn = $2';
        const existsResult = await pool.query(existsQuery, [email, ssn]);
        if (existsResult.rows.length > 0) {
            return res.status(409).json({ success: false, message: "Librarian already exists" });
        }

        const insertQuery = 'INSERT INTO "Librarians" (ssn, name, email, salary) VALUES ($1, $2, $3, $4)';
        const result = await pool.query(insertQuery, [ssn, name, email, salary]);
        if (result.rowCount > 0) {
            res.json({ success: true, message: "Librarian registered successfully" });
        } else {
            res.status(500).json({ success: false, message: "Failed to register librarian" });
        }
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

app.post('/signup/client', async (req, res) => {
    const { email, name } = req.body;
    if (!(email && name)) {
        return res.status(400).json({ success: false, message: "Email and name are required" });
    }

    try {
        const existsQuery = 'SELECT * FROM "Clients" WHERE email = $1';
        const existsResult = await pool.query(existsQuery, [email]);
        if (existsResult.rows.length > 0) {
            return res.status(409).json({ success: false, message: "Client already exists" });
        }

        const insertQuery = 'INSERT INTO "Clients" (email, name) VALUES ($1, $2)';
        const result = await pool.query(insertQuery, [email, name]);
        if (result.rowCount > 0) {
            res.json({ success: true, message: "Client registered successfully" });
        } else {
            res.status(500).json({ success: false, message: "Failed to register client" });
        }
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

app.post('/addbook', async (req, res) => {
    const { title, authors, isbn, publisher, year, edition, pages } = req.body;

    try {
        const documentId = await addDocumentAndAuthors(title, 'paper', publisher, year, authors);
        const insertBookQuery = 'INSERT INTO public."Book" (document_id, isbn, edition, pages) VALUES ($1, $2, $3, $4)';
        await pool.query(insertBookQuery, [documentId, isbn, edition, pages]);
        res.json({ success: true, message: "Book added successfully" });
    } catch (error) {
        console.error("Error in addBook:", error);
        res.status(500).json({ success: false, message: "Failed to add book" });
    }
});

app.post('/addmagazine', async (req, res) => {
    const { title, authors, isbn, publisher, year, month } = req.body;

    try {
        const documentId = await addDocumentAndAuthors(title, 'paper', publisher, year, null);
        const insertMagQuery = 'INSERT INTO public."Magazine" (document_id, isbn, month) VALUES ($1, $2, $3)';
        await pool.query(insertMagQuery, [documentId, isbn, month]);
        res.json({ success: true, message: "Magazine added successfully" });
    } catch (error) {
        console.error("Error in addMagazine:", error);
        res.status(500).json({ success: false, message: "Failed to add magazine" });
    }
});

app.post('/addjournalarticle', async (req, res) => {
    const { title, authors, journal_name, issue_number, article_number, year, publisher } = req.body;

    try {
        const documentId = await addDocumentAndAuthors(title, 'electronic', publisher, year, authors);
        const insertJournalQuery = `INSERT INTO public."JournalArticle" (document_id, journal_name, issue_number, article_number) VALUES ($1, $2, $3, $4)`;
        await pool.query(insertJournalQuery, [documentId, journal_name, issue_number, article_number]);
        res.json({ success: true, message: "Journal article added successfully" });
    } catch (error) {
        console.error("Error in addJournalArticle:", error);
        res.status(500).json({ success: false, message: "Failed to add journal article" });
    }
});

async function addDocumentAndAuthors(title, documentType, publisher, year, authors) {
    await pool.query('BEGIN');
    try {
        const docInsertQuery = 'INSERT INTO public."Document" (title, document_type, publisher, year) VALUES ($1, $2, $3, $4) RETURNING document_id';
        const docValues = [title, documentType, publisher, year];
        const docResponse = await pool.query(docInsertQuery, docValues);
        const documentId = docResponse.rows[0].document_id;

        if (authors) {
            const authorsArray = authors.split(',').map(author => author.trim()).filter(author => author !== "");
            for (const authorName of authorsArray) {
                let authorId;
                const authorQuery = 'SELECT author_id FROM public."Author" WHERE name = $1';
                const authorRes = await pool.query(authorQuery, [authorName]);

                if (authorRes.rows.length === 0) {
                    const insertAuthorQuery = 'INSERT INTO public."Author" (name) VALUES ($1) RETURNING author_id';
                    const authorInsertRes = await pool.query(insertAuthorQuery, [authorName]);
                    authorId = authorInsertRes.rows[0].author_id;
                } else {
                    authorId = authorRes.rows[0].author_id;
                }

                const docAuthorQuery = 'INSERT INTO public."DocumentAuthor" (document_id, author_id) VALUES ($1, $2)';
                await pool.query(docAuthorQuery, [documentId, authorId]);
            }
        }

        await pool.query('COMMIT');
        return documentId;
    } catch (err) {
        await pool.query('ROLLBACK');
        throw err;
    }
}

app.get('/document/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch basic document data
        const docQuery = 'SELECT * FROM public."Document" WHERE document_id = $1';
        const docResult = await pool.query(docQuery, [id]);
        if (docResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }
        const document = docResult.rows[0];

        // Prepare to fetch details from potentially related tables
        const queries = [
            pool.query('SELECT * FROM public."Book" WHERE document_id = $1', [id]),
            pool.query('SELECT * FROM public."Magazine" WHERE document_id = $1', [id]),
            pool.query('SELECT * FROM public."JournalArticle" WHERE document_id = $1', [id])
        ];

        // Execute all queries concurrently
        const results = await Promise.all(queries);
        let details = null;
        let type = '';
        const detailsIndex = results.findIndex(result => result.rows.length > 0);

        if (detailsIndex !== -1) {
            details = results[detailsIndex].rows[0];
            // Determine the type based on the index of the details
            switch (detailsIndex) {
                case 0:
                    type = 'Book';
                    break;
                case 1:
                    type = 'Magazine';
                    break;
                case 2:
                    type = 'JournalArticle';
                    break;
                default:
                    type = 'Unknown'; // In case of unexpected index
            }
        }

        // Combine document info with details
        const result = {
            ...document,
            details: details,
            type: type  // Include the type of document
        };

        res.json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching document:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.delete('/delete/document/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('BEGIN');  // Start a new transaction

        // Fetch the document type first to decide which table to delete from
        const docTypeQuery = 'SELECT document_type FROM public."Document" WHERE document_id = $1';
        const typeResult = await pool.query(docTypeQuery, [id]);
        if (typeResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        const documentType = typeResult.rows[0].document_type;
        let deleteDetailQuery = '';

        switch (documentType) {
            case 'paper':
                // Check if it's a book or magazine
                const checkBook = 'SELECT * FROM public."Book" WHERE document_id = $1';
                const bookResult = await pool.query(checkBook, [id]);
                if (bookResult.rows.length > 0) {
                    deleteDetailQuery = 'DELETE FROM public."Book" WHERE document_id = $1';
                } else {
                    deleteDetailQuery = 'DELETE FROM public."Magazine" WHERE document_id = $1';
                }
                break;
            case 'electronic':
                deleteDetailQuery = 'DELETE FROM public."JournalArticle" WHERE document_id = $1';
                break;
            default:
                await pool.query('ROLLBACK');
                return res.status(400).json({ success: false, message: "Invalid document type" });
        }

        // Delete the specific document details first
        await pool.query(deleteDetailQuery, [id]);

        // Then delete the document itself
        const deleteDocQuery = 'DELETE FROM public."Document" WHERE document_id = $1';
        await pool.query(deleteDocQuery, [id]);

        await pool.query('COMMIT');  // Commit the transaction
        res.json({ success: true, message: "Document and related data deleted successfully" });
    } catch (error) {
        await pool.query('ROLLBACK');  // Roll back the transaction in case of an error
        console.error("Error deleting document:", error);
        res.status(500).json({ success: false, message: "Failed to delete document" });
    }
});


app.post('/update/document', async (req, res) => {
    const { id, title, authors, isbn, publisher, year, edition, pages, month, issue_number, article_number, type } = req.body;

    try {
        await pool.query('BEGIN');

        const updateDocQuery = `
            UPDATE public."Document"
            SET title = $1, publisher = $2, year = $3
            WHERE document_id = $4`;
        await pool.query(updateDocQuery, [title, publisher, year, id]);

        let updateDetailsQuery = '';
        let params = [];

        switch (type) {
            case 'Book':
                updateDetailsQuery = `
                    UPDATE public."Book"
                    SET isbn = $1, edition = $2, pages = $3
                    WHERE document_id = $4`;
                params = [isbn, edition, pages, id];
                break;
            case 'Magazine':
                updateDetailsQuery = `
                    UPDATE public."Magazine"
                    SET isbn = $1, month = $2
                    WHERE document_id = $3`;
                params = [isbn, month, id];
                break;
            case 'JournalArticle':
                updateDetailsQuery = `
                    UPDATE public."JournalArticle"
                    SET journal_name = $1, issue_number = $2, article_number = $3
                    WHERE document_id = $4`;
                params = [publisher, issue_number, article_number, id]; // Assuming 'publisher' field holds 'journal_name' for simplicity
                break;
        }

        if (updateDetailsQuery) {
            await pool.query(updateDetailsQuery, params);
        }

        await pool.query('COMMIT');
        res.json({ success: true, message: "Document updated successfully" });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error updating document:", error);
        res.status(500).json({ success: false, message: "Failed to update document" });
    }
});

app.post('/create/client', async (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
        return res.status(400).json({ success: false, message: "Both email and name are required." });
    }

    try {
        const existsQuery = 'SELECT 1 FROM public."Clients" WHERE email = $1';
        const existsResult = await pool.query(existsQuery, [email]);

        if (existsResult.rowCount > 0) {
            return res.status(409).json({ success: false, message: "Client with this email already exists." });
        }

        const insertQuery = 'INSERT INTO public."Clients" (email, name) VALUES ($1, $2)';
        await pool.query(insertQuery, [email, name]);

        res.json({ success: true, message: "Client created successfully." });
    } catch (err) {
        console.error("Error creating client:", err);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

app.get('/client/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const query = 'SELECT * FROM "Clients" WHERE email = $1';
        const result = await pool.query(query, [email]);
        if (result.rows.length > 0) {
            res.json({ success: true, data: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: "Client not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post('/update/client', async (req, res) => {
    const { currentEmail, newEmail, name } = req.body;

    if (!currentEmail || !name) {
        return res.status(400).json({ success: false, message: "Current email and name are required." });
    }

    try {
        // Check if the client exists with the current email
        const clientExist = await pool.query('SELECT * FROM public."Clients" WHERE email = $1', [currentEmail]);
        if (clientExist.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Client not found." });
        }

        // Update client details
        const updateQuery = 'UPDATE public."Clients" SET email = $1, name = $2 WHERE email = $3 RETURNING *';
        const params = [newEmail || currentEmail, name, currentEmail];
        const updateResult = await pool.query(updateQuery, params);

        if (updateResult.rows.length > 0) {
            res.json({ success: true, message: "Client updated successfully", data: updateResult.rows[0] });
        } else {
            res.status(500).json({ success: false, message: "Failed to update client." });
        }
    } catch (error) {
        console.error("Error updating client:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

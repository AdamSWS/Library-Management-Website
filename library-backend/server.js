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
    const { title, authors, journal_name, issue_number, article_number, year } = req.body;

    try {
        const documentId = await addDocumentAndAuthors(title, 'electronic', null, year, authors);
        const insertJournalQuery = 'INSERT INTO public."JournalArticle" (document_id, journal_name, issue_number, article_number) VALUES ($1, $2, $3, $4)';
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


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./database");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/librarian/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const query = 'SELECT * FROM "Librarians" WHERE email = $1';
    const result = await pool.query(query, [email]);
    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "Librarian not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/client/:email", async (req, res) => {
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
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/login/librarian", async (req, res) => {
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
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/login/client", async (req, res) => {
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
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/signup/librarian", async (req, res) => {
  const { ssn, name, email, salary } = req.body;
  if (!(email && name && ssn && salary)) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  try {
    const existsQuery =
      'SELECT * FROM "Librarians" WHERE email = $1 OR ssn = $2';
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
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.post("/signup/client", async (req, res) => {
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
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.post("/addbook", async (req, res) => {
  const { title, authors, isbn, publisher, year, edition, pages } = req.body;
  try {
    const documentId = await addDocumentAndAuthors(title, "paper", publisher, year, authors);
    const insertBookQuery = 'INSERT INTO public."Book" (document_id, isbn, edition, pages) VALUES ($1, $2, $3, $4)';
    await pool.query(insertBookQuery, [documentId, isbn, edition, pages]);
    res.json({ success: true, message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add book" });
  }
});

app.post("/addmagazine", async (req, res) => {
  const { title, authors, isbn, publisher, year, month } = req.body;
  try {
    const documentId = await addDocumentAndAuthors(title, "paper", publisher, year, null);
    const insertMagQuery = 'INSERT INTO public."Magazine" (document_id, isbn, month) VALUES ($1, $2, $3)';
    await pool.query(insertMagQuery, [documentId, isbn, month]);
    res.json({ success: true, message: "Magazine added successfully" });
  } catch (error) {
    console.error("Error in addMagazine:", error);
    res.status(500).json({ success: false, message: "Failed to add magazine" });
  }
});

app.post("/addjournalarticle", async (req, res) => {
  const { title, authors, journal_name, issue_number, article_number, year, publisher } = req.body;
  try {
    const documentId = await addDocumentAndAuthors(title, "electronic", publisher, year, authors);
    const insertJournalQuery = `INSERT INTO public."JournalArticle" (document_id, journal_name, issue_number, article_number) VALUES ($1, $2, $3, $4)`;
    await pool.query(insertJournalQuery, [documentId, journal_name, issue_number, article_number]);
    res.json({ success: true, message: "Journal article added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add journal article" });
  }
});

async function addDocumentAndAuthors(title, documentType, publisher, year, authors) {
  try {
    const docInsertQuery = 'INSERT INTO public."Document" (title, document_type, publisher, year) VALUES ($1, $2, $3, $4) RETURNING document_id';
    const docValues = [title, documentType, publisher, year];
    const docResponse = await pool.query(docInsertQuery, docValues);
    const documentId = docResponse.rows[0].document_id;
    if (authors) {
      const authorsArray = authors.split(",").map((author) => author.trim()).filter((author) => author !== "");
      for (const authorName of authorsArray) {
        let authorId;
        const authorQuery = 'SELECT author_id FROM public."Author" WHERE name = $1';
        const authorRes = await pool.query(authorQuery, [authorName]);
        if (authorRes.rows.length === 0) {
          const insertAuthorQuery = 'INSERT INTO public."Author" (name) VALUES ($1) RETURNING author_id';
          const authorInsertRes = await pool.query(insertAuthorQuery, [authorName, ]);
          authorId = authorInsertRes.rows[0].author_id;
        } else {
          authorId = authorRes.rows[0].author_id;
        }
        const docAuthorQuery = 'INSERT INTO public."DocumentAuthor" (document_id, author_id) VALUES ($1, $2)';
        await pool.query(docAuthorQuery, [documentId, authorId]);
      }
    }
    return documentId;
  } catch (err) {
    throw err;
  }
}

app.get("/document/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const docQuery = 'SELECT * FROM public."Document" WHERE document_id = $1';
    const docResult = await pool.query(docQuery, [id]);
    if (docResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    const document = docResult.rows[0];
    const queries = [
      pool.query('SELECT * FROM public."Book" WHERE document_id = $1', [id]),
      pool.query('SELECT * FROM public."Magazine" WHERE document_id = $1', [id,]),
      pool.query('SELECT * FROM public."JournalArticle" WHERE document_id = $1', [id]),
    ];

    const results = await Promise.all(queries);
    let details = null;
    let type = "";
    const detailsIndex = results.findIndex((result) => result.rows.length > 0);
    if (detailsIndex !== -1) {
      details = results[detailsIndex].rows[0];
      switch (detailsIndex) {
        case 0:
          type = "Book";
          break;
        case 1:
          type = "Magazine";
          break;
        case 2:
          type = "JournalArticle";
          break;
        default:
          type = "Unknown";
      }
    }
    const result = {
      ...document,
      details: details,
      type: type,
    };
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/delete/document/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("BEGIN");
    const docTypeQuery = 'SELECT document_type FROM public."Document" WHERE document_id = $1';
    const typeResult = await pool.query(docTypeQuery, [id]);
    if (typeResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    const documentType = typeResult.rows[0].document_type;
    let deleteDetailQuery = "";
    switch (documentType) {
      case "paper":
        const checkBook = 'SELECT * FROM public."Book" WHERE document_id = $1';
        const bookResult = await pool.query(checkBook, [id]);
        if (bookResult.rows.length > 0) {
          deleteDetailQuery =
            'DELETE FROM public."Book" WHERE document_id = $1';
        } else {
          deleteDetailQuery =
            'DELETE FROM public."Magazine" WHERE document_id = $1';
        }
        break;
      case "electronic":
        deleteDetailQuery =
          'DELETE FROM public."JournalArticle" WHERE document_id = $1';
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid document type" });
    }
    await pool.query(deleteDetailQuery, [id]);
    const deleteDocQuery = 'DELETE FROM public."Document" WHERE document_id = $1';
    await pool.query(deleteDocQuery, [id]);
    res.json({success: true, message: "Document and related data deleted successfully", });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete document" });
  }
});

app.post("/update/document", async (req, res) => {
  const { id, title, authors, isbn, publisher, year, edition, pages, month, issue_number, article_number, type, } = req.body;
  try {
    const updateDocQuery = `UPDATE public."Document" SET title = $1, publisher = $2, year = $3 WHERE document_id = $4`;
    await pool.query(updateDocQuery, [title, publisher, year, id]);
    let updateDetailsQuery = "";
    let params = [];
    switch (type) {
      case "Book":
        updateDetailsQuery = `
                    UPDATE public."Book"
                    SET isbn = $1, edition = $2, pages = $3
                    WHERE document_id = $4`;
        params = [isbn, edition, pages, id];
        break;
      case "Magazine":
        updateDetailsQuery = `
                    UPDATE public."Magazine"
                    SET isbn = $1, month = $2
                    WHERE document_id = $3`;
        params = [isbn, month, id];
        break;
      case "JournalArticle":
        updateDetailsQuery = `
                    UPDATE public."JournalArticle"
                    SET journal_name = $1, issue_number = $2, article_number = $3
                    WHERE document_id = $4`;
        params = [publisher, issue_number, article_number, id];
        break;
    }
    if (updateDetailsQuery) {
      await pool.query(updateDetailsQuery, params);
    }
    res.json({ success: true, message: "Document updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update document" });
  }
});

app.post("/create/client", async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, message: "Both email and name are required." });
  }

  try {
    const existsQuery = 'SELECT 1 FROM public."Clients" WHERE email = $1';
    const existsResult = await pool.query(existsQuery, [email]);
    if (existsResult.rowCount > 0) {
      return res.status(409).json({ success: false, message: "Client with this email already exists.", });
    }
    const insertQuery = 'INSERT INTO public."Clients" (email, name) VALUES ($1, $2)';
    await pool.query(insertQuery, [email, name]);
    res.json({ success: true, message: "Client created successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.get("/client/:email", async (req, res) => {
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
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  

app.post("/update/client", async (req, res) => {
  const { currentEmail, newEmail, name } = req.body;
  if (!currentEmail || !name) {
    return res.status(400).json({ success: false, message: "Current email and name are required.", });
  }
  try {
    const clientExist = await pool.query(
      'SELECT * FROM public."Clients" WHERE email = $1',
      [currentEmail]
    );
    if (clientExist.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found." });
    }
    const updateQuery = 'UPDATE public."Clients" SET email = $1, name = $2 WHERE email = $3 RETURNING *';
    const params = [newEmail || currentEmail, name, currentEmail];
    const updateResult = await pool.query(updateQuery, params);

    if (updateResult.rows.length > 0) {
      res.json({ success: true, message: "Client updated successfully", data: updateResult.rows[0], });
    } else {
      res.status(500).json({ success: false, message: "Failed to update client." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

app.post("/update/librarian", async (req, res) => {
  const { ssn, name, email, salary } = req.body;
  if (!ssn || !name || !email || !salary) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const result = await pool.query('UPDATE public."Librarians" SET name = $1, email = $2, salary = $3 WHERE ssn = $4 RETURNING *;', [name, email, salary, ssn]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: "Librarian updated successfully", data: result.rows[0], });
    } else {
      res.status(404).json({ success: false, message: "Librarian not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/inventory', async (req, res) => {
    try {
        const inventoryQuery = `
            SELECT d.document_id, d.title, COUNT(dc.copy_id) AS total_copies, COUNT(l.lending_id) AS loaned_copies FROM public."Document" d LEFT JOIN public."DocumentCopy" dc ON d.document_id = dc.document_id LEFT JOIN public."Lending" l ON dc.copy_id = l.copy_id AND l.return_date > CURRENT_DATE GROUP BY d.document_id ORDER BY d.title;
        `;
        const result = await pool.query(inventoryQuery);
        if (result.rows.length > 0) {
            const inventoryData = result.rows.map(doc => ({ documentTitle: doc.title, copiesAvailable: doc.total_copies - doc.loaned_copies, copiesLoaned: doc.loaned_copies }));
            res.json({ success: true, data: inventoryData });
        } else {
            res.status(404).json({ success: false, message: "No inventory found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.get("/overdues", async (req, res) => {
    try {
        const overdueQuery = `
            SELECT l.lending_id, d.title AS documentTitle, c.email AS clientEmail, l.return_date AS dueDate, (CURRENT_DATE - l.return_date) AS daysOverdue, CASE WHEN CURRENT_DATE > l.return_date THEN ROUND((CURRENT_DATE - l.return_date) * 1.5, 2) ELSE 0 END AS fee FROM public."Lending" l JOIN public."DocumentCopy" dc ON l.copy_id = dc.copy_id JOIN public."Document" d ON dc.document_id = d.document_id JOIN public."Clients" c ON l.client_email = c.email WHERE l.return_date < CURRENT_DATE`;
        const result = await pool.query(overdueQuery);
        if (result.rows.length > 0) {
            res.json({ success: true, data: result.rows });
        } else {
            res.status(404).json({ success: false, message: "No overdue loans found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/search/documents", async (req, res) => {
  const { query, type } = req.body;
  console.log(query, type);
  console.log(req.body);
  //to do
  // detect if query is title, author or ISBN
  // isbn is a number
  // author is a string
  // title is a string

  switch (type) {
    case "All":
      try {
        // search for documents with title, author or ISBN matching the query
        // use ILIKE for case-insensitive search
        // get isbns from books and magazines
        // get authors from documentauthor and authors
        // combine results
        const searchQuery = `
                SELECT d.document_id, d.title, 
                    CAST(COALESCE(b.isbn, m.isbn) AS VARCHAR) AS isbn, 
                    STRING_AGG(a.name, ', ') AS authors,
                    d.year AS year
                FROM public."Document" d
                LEFT JOIN public."Book" b ON d.document_id = b.document_id
                LEFT JOIN public."Magazine" m ON d.document_id = m.document_id
                LEFT JOIN public."JournalArticle" ja ON d.document_id = ja.document_id 
                LEFT JOIN public."DocumentAuthor" da ON d.document_id = da.document_id
                LEFT JOIN public."Author" a ON da.author_id = a.author_id
                WHERE d.title ILIKE $1 OR COALESCE(b.isbn, m.isbn) ILIKE $1 OR a.name ILIKE $1
                GROUP BY d.document_id, d.title, COALESCE(b.isbn, m.isbn), d.year
                ORDER BY d.title`;
        const searchResult = await pool.query(searchQuery, [`%${query}%`]);
        res.status(200).json({ success: true, data: searchResult.rows });
      } catch (error) {
        console.error("Error searching documents:", error);
        res
          .status(500)
          .json({ success: false, message: "Server error", data: [] });
      }
      break;
    case "Book":
      // search for books with title, author or ISBN matching the query
      // use ILIKE for case-insensitive search
      // get isbns from books
      // get authors from documentauthor and authors
      // combine results
      try {
        const searchQuery = `
                SELECT d.document_id, d.title,
                    b.isbn,
                    STRING_AGG(a.name, ', ') AS authors,
                    d.year AS year
                FROM public."Document" d
                JOIN public."Book" b ON d.document_id = b.document_id
                LEFT JOIN public."DocumentAuthor" da ON d.document_id = da.document_id
                LEFT JOIN public."Author" a ON da.author_id = a.author_id
                WHERE d.title ILIKE $1 OR b.isbn ILIKE $1 OR a.name ILIKE $1
                GROUP BY d.document_id, d.title, b.isbn, d.year
                ORDER BY d.title`;
        const searchResult = await pool.query(searchQuery, [`%${query}%`]);
        res.status(200).json({ success: true, data: searchResult.rows });
      } catch (error) {
        console.error("Error searching books:", error);
        res
          .status(500)
          .json({ success: false, message: "Server error", data: [] });
      }
      break;
    case "Magazine":
      // search for magazines with title, author or ISBN matching the query
      // use ILIKE for case-insensitive search
      // get isbns from magazines
      // get authors from documentauthor and authors
      // combine results
      try {
        const searchQuery = `
                SELECT d.title,
                    m.isbn,
                    STRING_AGG(a.name, ', ') AS authors,
                    d.year AS year
                FROM public."Document" d
                JOIN public."Magazine" m ON d.document_id = m.document_id
                LEFT JOIN public."DocumentAuthor" da ON d.document_id = da.document_id
                LEFT JOIN public."Author" a ON da.author_id = a.author_id
                WHERE d.title ILIKE $1 OR m.isbn ILIKE $1 OR a.name ILIKE $1
                GROUP BY d.title, m.isbn, d.year
                ORDER BY d.title`;
        const searchResult = await pool.query(searchQuery, [`%${query}%`]);
        res.status(200).json({ success: true, data: searchResult.rows });
      } catch (error) {
        console.error("Error searching magazines:", error);
        res
          .status(500)
          .json({ success: false, message: "Server error", data: [] });
      }

      break;
    case "Journal Article":
      // search for journal articles with title, author or ISBN matching the query
      // use ILIKE for case-insensitive search
      // get authors from documentauthor and authors
      // combine results
      const searchQuery = `
            SELECT d.title,
                ja.journal_name AS journal,
                ja.issue_number AS issue,
                ja.article_number AS article,
                d.year AS year
            FROM public."Document" d
            JOIN public."JournalArticle" ja ON d.document_id = ja.document_id
            LEFT JOIN public."DocumentAuthor" da ON d.document_id = da.document_id
            LEFT JOIN public."Author" a ON da.author_id = a.author_id
            WHERE d.title ILIKE $1 OR ja.journal_name ILIKE $1 OR a.name ILIKE $1
            ORDER BY d.title`;
      try {
        const searchResult = await pool.query(searchQuery, [`%${query}%`]);
        res.status(200).json({ success: true, data: searchResult.rows });
      } catch (error) {
        console.error("Error searching journal articles:", error);
        res
          .status(500)
          .json({ success: false, message: "Server error", data: [] });
      }
      break;
    default:
      res
        .status(400)
        .json({ success: false, message: "Invalid document type", data: [] });
  }
});

app.post("/document/copies", async (req, res) => {
  const { documentIds } = req.body;
  try {
    const query = `SELECT document_id, COUNT(copy_id) AS copy_count FROM public."DocumentCopy" WHERE document_id = ANY($1) GROUP BY document_id;`;
    const result = await pool.query(query, [documentIds]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/create/copy", async (req, res) => {
  const { document_id, numCopies } = req.body;
  if (!document_id || numCopies <= 0) {
    return res.status(400).json({ success: false, message: "Invalid document ID or number of copies", });
  }
  try {
    for (let i = 0; i < numCopies; i++) {
      const insertQuery =
        'INSERT INTO public."DocumentCopy" (document_id) VALUES ($1)';
      await pool.query(insertQuery, [document_id]);
    }
    res.json({ success: true, message: `Successfully created ${numCopies} copies.`,});
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create copies" });
  }
});

app.post("/create/lending", async (req, res) => {
  const { copy_id, client_email, lend_date, return_date } = req.body;
  if (!copy_id || !client_email || !lend_date || !return_date) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }
  try {
    const existsQuery = `SELECT * FROM public."Lending" WHERE copy_id = $1 AND client_email = $2`;
    const existsResult = await pool.query(existsQuery, [copy_id, client_email]);

    if (existsResult.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Lending record already exists for this document and client.", });
    }

    const insertQuery = `INSERT INTO public."Lending" (copy_id, client_email, lend_date, return_date) VALUES ($1, $2, $3, $4) RETURNING lending_id;`;
    const result = await pool.query(insertQuery, [ copy_id, client_email, lend_date, return_date, ]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: "Lending created successfully", lendingId: result.rows[0].lending_id, });
    } else {
      res.status(500).json({ success: false, message: "Failed to create lending record" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/lendings/active-loans", async (req, res) => {
    try {
      const query = `
              SELECT 
                  l.lending_id, 
                  l.copy_id, 
                  l.lend_date, 
                  l.return_date,
                  l.client_email, 
                  d.title, 
                  (CURRENT_DATE > l.return_date) AS is_overdue
              FROM 
                  public."Lending" l
              JOIN 
                  public."DocumentCopy" dc ON l.copy_id = dc.copy_id
              JOIN 
                  public."Document" d ON dc.document_id = d.document_id`;
      const result = await pool.query(query);
      console.log(result.rows);
      if (result.rows.length > 0) {
        res.json({ success: true, data: result.rows });
      } else {
        res
          .status(404)
          .json({ success: false, message: "No active lendings found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

app.get("/lendings/:client_email", async (req, res) => {
  const { client_email } = req.params;
  try {
    const query = `SELECT l.lending_id, l.copy_id, l.lend_date, l.return_date, d.title, (CURRENT_DATE > l.return_date) AS is_overdue FROM public."Lending" l JOIN public."DocumentCopy" dc ON l.copy_id = dc.copy_id JOIN public."Document" d ON dc.document_id = d.document_id WHERE l.client_email = $1;`;
    const result = await pool.query(query, [client_email]);
    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows });
    } else {
      res.status(404).json({ success: false, message: "No active lendings found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/delete/lending/:lending_id", async (req, res) => {
  const { lending_id } = req.params;
  try {
    const deleteQuery = 'DELETE FROM public."Lending" WHERE lending_id = $1';
    const result = await pool.query(deleteQuery, [lending_id]);
    if (result.rowCount > 0) {
      res.json({ success: true, message: "Lending record deleted successfully", });
    } else {
      res.status(404).json({ success: false, message: "Lending record not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete('/clients/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const deleteQuery = 'DELETE FROM public."Clients" WHERE email = $1';
        const result = await pool.query(deleteQuery, [email]);
        if (result.rowCount > 0) {
            res.json({ success: true, message: "Client deleted successfully." });
        } else {
            res.status(404).json({ success: false, message: "Client not found." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post('/client/addCard', async (req, res) => {
    const { cardNumber, clientEmail } = req.body;
    if (!cardNumber || !clientEmail) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    try {
        const insertQuery = `INSERT INTO "CreditCards" (card_number, client_email) VALUES ($1, $2) RETURNING *;`;
        const result = await pool.query(insertQuery, [cardNumber, clientEmail]);
        if (result.rows.length > 0) {
            res.json({ success: true, card: result.rows[0], message: 'Card added successfully' });
        } else {
            res.status(400).json({ success: false, message: 'No card was inserted' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add card', error: error.message });
    }
});

app.get('/client/:email/cards', async (req, res) => {
  const { email } = req.params;
  console.log("HELLO");
  console.log(email);
  try {
      const query = `SELECT * FROM "CreditCards" WHERE client_email = $1;`;
      const result = await pool.query(query, [email]);
      if (result.rows.length > 0) {
          res.json({ success: true, cards: result.rows });
      } else {
          res.status(404).json({ success: false, message: 'No cards found' });
      }
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
});


app.delete('/client/:email/cards/:cardNumber', async (req, res) => {
    const { email, cardNumber } = req.params;
    try {
        const deleteQuery = `DELETE FROM "CreditCards" WHERE client_email = $1 AND card_number = $2;`;
        const result = await pool.query(deleteQuery, [email, cardNumber]);
        if (result.rowCount > 0) {
            res.json({ success: true, message: 'Card deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Card not found or could not be deleted' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
});

app.put('/client/:email/cards/:oldCardNumber', async (req, res) => {
  const { email, oldCardNumber } = req.params;
  const { newCardNumber } = req.body;
  console.log(email);
  console.log(newCardNumber);
  console.log(selectedCard.card_number);
  if (!newCardNumber) {
      return res.status(400).json({ success: false, message: "New card number must be provided" });
  }

  try {
      const updateQuery = `
          UPDATE "CreditCards" 
          SET card_number = $3 
          WHERE client_email = $2 AND card_number = $1 
          RETURNING *;
      `;
      const result = await pool.query(updateQuery, [newCardNumber, email, oldCardNumber]);
      if (result.rows.length > 0) {
          res.json({ success: true, card: result.rows[0], message: 'Card updated successfully' });
      } else {
          res.status(404).json({ success: false, message: 'Card not found or could not be updated' });
      }
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Database error', error: error.message });
  }
});


app.get('/client/:email/hasCard', async (req, res) => {

  const { email } = req.params;
    try {
        const query = `SELECT EXISTS(SELECT 1 FROM "CreditCards" WHERE client_email = $1)`;
        const result = await pool.query(query, [email]);
        const hasCard = result.rows[0].exists; 
        res.json({ success: true, hasCard: hasCard });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ success: false, message: 'Database error', error: error.message });
    }
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

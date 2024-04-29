const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./database");

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.get("/librarian/:email", async (req, res) => {
  //this function is used to get the librarian details by email
  //it takes the email as a parameter and returns the librarian details
  //if the librarian is not found, it returns a 404 status code
  //if there is a server error, it returns a 500 status code
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
  //this function is used to get the client details by email
  //it takes the email as a parameter and returns the client details
  //if the client is not found, it returns a 404 status code
  //if there is a server error, it returns a 500 status code
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
  //this function is used to login a librarian
  //it takes the email and ssn as parameters
  //it returns a success message if the login is successful
  //it returns an error message if the login is unsuccessful
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
  //this function is used to login a client
  //it takes the email as a parameter
  //it returns a success message if the login is successful
  //it returns an error message if the login is unsuccessful
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
  //this function is used to register a librarian
  //it takes the ssn, name, email and salary as parameters
  //it returns a success message if the registration is successful
  //it returns an error message if the registration is unsuccessful
  const { ssn, name, email, salary } = req.body;
  if (!(email && name && ssn && salary)) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  try {
    //check if the librarian already exists
    //if the librarian already exists, return an error message
    //if the librarian does not exist, register the librarian
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
  //this function is used to register a client
  //it takes the email and name as parameters
  //it returns a success message if the registration is successful
  //it returns an error message if the registration is unsuccessful
  //it returns a 400 status code if the email and name are not provided
  //it returns a 409 status code if the client already exists
  const { email, name } = req.body;
  if (!(email && name)) {
    return res.status(400).json({ success: false, message: "Email and name are required" });
  }
  try {
    //check if the client already exists
    //if the client already exists, return an error message
    //if the client does not exist, register the client
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
  //this function is used to add a book
  //it takes the title, authors, isbn, publisher, year, edition and pages as parameters
  //it returns a success message if the book is added successfully
  //it returns an error message if the book is not added successfully
  //it returns a 500 status code if there is a server error
  const { title, authors, isbn, publisher, year, edition, pages } = req.body;
  try {
    //add the book to the database
    //if the book is added successfully, return a success message
    //if the book is not added successfully, return an error message
    const documentId = await addDocumentAndAuthors(title, "paper", publisher, year, authors);
    const insertBookQuery = 'INSERT INTO public."Book" (document_id, isbn, edition, pages) VALUES ($1, $2, $3, $4)';
    await pool.query(insertBookQuery, [documentId, isbn, edition, pages]);
    res.json({ success: true, message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add book" });
  }
});

app.post("/addmagazine", async (req, res) => {
  //this function is used to add a magazine
  //it takes the title, authors, isbn, publisher, year and month as parameters
  //it returns a success message if the magazine is added successfully
  //it returns an error message if the magazine is not added successfully
  const { title, authors, isbn, publisher, year, month } = req.body;
  try {
    //add the magazine to the database
    //if the magazine is added successfully, return a success message
    //if the magazine is not added successfully, return an error message
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
  //this function is used to add a journal article
  //it takes the title, authors, journal_name, issue_number, article_number, year and publisher as parameters
  //it returns a success message if the journal article is added successfully
  //it returns an error message if the journal article is not added successfully
  const { title, authors, journal_name, issue_number, article_number, year, publisher } = req.body;
  try {
    //add the journal article to the database
    //if the journal article is added successfully, return a success message
    //if the journal article is not added successfully, return an error message
    const documentId = await addDocumentAndAuthors(title, "electronic", publisher, year, authors);
    const insertJournalQuery = `INSERT INTO public."JournalArticle" (document_id, journal_name, issue_number, article_number) VALUES ($1, $2, $3, $4)`;
    await pool.query(insertJournalQuery, [documentId, journal_name, issue_number, article_number]);
    res.json({ success: true, message: "Journal article added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add journal article" });
  }
});

async function addDocumentAndAuthors(title, documentType, publisher, year, authors) {
  //this function is used to add a document and its authors
  //it takes the title, document type, publisher, year and authors as parameters
  //it returns the document id
  try {
    //add the document to the database
    //if the document is added successfully, return the document id
    //if the document is not added successfully, throw an error
    const docInsertQuery = 'INSERT INTO public."Document" (title, document_type, publisher, year) VALUES ($1, $2, $3, $4) RETURNING document_id';
    const docValues = [title, documentType, publisher, year];
    const docResponse = await pool.query(docInsertQuery, docValues);
    const documentId = docResponse.rows[0].document_id;
    if (authors) {
      const authorsArray = authors.split(",").map((author) => author.trim()).filter((author) => author !== "");
      for (const authorName of authorsArray) {
        let authorId;
        //check if the author already exists
        //if the author already exists, get the author id
        //if the author does not exist, add the author and get the author id
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
  //this function is used to get the document details by id
  //it takes the id as a parameter and returns the document details
  //if the document is not found, it returns a 404 status code
  //if there is a server error, it returns a 500 status code
  const { id } = req.params;
  try {
    //get the document details by id
    //if the document is found, return the document details
    //if the document is not found, return a 404 status code
    //if there is a server error, return a 500 status code
    const docQuery = 'SELECT * FROM public."Document" WHERE document_id = $1';
    const docResult = await pool.query(docQuery, [id]);
    if (docResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    //get the document details
    //if the document details are found, return the document details
    //if the document details are not found, return a 404 status code
    //if there is a server error, return a 500 status code
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
  //this function is used to delete a document by id
  //it takes the id as a parameter
  //it returns a success message if the document is deleted successfully
  //it returns an error message if the document is not deleted successfully
  const { id } = req.params;
  try {
    //delete the document by id
    //if the document is deleted successfully, return a success message
    //if the document is not deleted successfully, return an error message
    await pool.query("BEGIN");
    const docTypeQuery = 'SELECT document_type FROM public."Document" WHERE document_id = $1';
    const typeResult = await pool.query(docTypeQuery, [id]);
    if (typeResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }
    const documentType = typeResult.rows[0].document_type;
    let deleteDetailQuery = "";
    //delete the document details based on the document type
    //if the document type is paper, delete the book or magazine details
    //if the document type is electronic, delete the journal article details
    //if the document type is unknown, return an error message
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
  //this function is used to update a document
  //it takes the id, title, authors, isbn, publisher, year, edition, pages, month, issue_number, article_number and type as parameters
  //it returns a success message if the document is updated successfully
  //it returns an error message if the document is not updated successfully
  const { id, title, authors, isbn, publisher, year, edition, pages, month, issue_number, article_number, type, } = req.body;
  try {
    //update the document by id
    //if the document is updated successfully, return a success message
    //if the document is not updated successfully, return an error message
    const updateDocQuery = `UPDATE public."Document" SET title = $1, publisher = $2, year = $3 WHERE document_id = $4`;
    await pool.query(updateDocQuery, [title, publisher, year, id]);
    let updateDetailsQuery = "";
    let params = [];
    //update the document details based on the document type
    //if the document type is paper, update the book or magazine details
    //if the document type is electronic, update the journal article details
    //if the document type is unknown, return an error message
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
  //this function is used to create a client
  //it takes the email and name as parameters
  //it returns a success message if the client is created successfully
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, message: "Both email and name are required." });
  }

  try {
    //check if the client already exists
    //if the client already exists, return an error message
    //if the client does not exist, create the client
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
  //this function is used to get the client details by email  
  //it takes the email as a parameter and returns the client details
  //if the client is not found, it returns a 404 status code
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
  //this function is used to update a client
  //it takes the current email, new email and name as parameters
  //it returns a success message if the client is updated successfully
  const { currentEmail, newEmail, name } = req.body;
  if (!currentEmail || !name) {
    return res.status(400).json({ success: false, message: "Current email and name are required.", });
  }
  try {
    //check if the client exists
    //if the client does not exist, return an error message
    //if the client exists, update the client
    const clientExist = await pool.query(
      'SELECT * FROM public."Clients" WHERE email = $1',
      [currentEmail]
    );
    if (clientExist.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found." });
    }
    //update the client
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
  //this function is used to update a librarian
  //it takes the ssn, name, email and salary as parameters
  const { ssn, name, email, salary } = req.body;
  if (!ssn || !name || !email || !salary) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  //check if the librarian exists
  //if the librarian does not exist, return an error message
  //if the librarian exists, update the librarian
  try {
    //check if the librarian exists
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
  //this function is used to get the inventory
  //it returns the inventory
    try {
      //get the inventory
      //if the inventory is found, return the inventory
      //if the inventory is not found, return a 404 status code
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
  //this function is used to get the overdue loans
  //it returns the overdue loans
    try {
      //get the overdue loans
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
  const { query, type} = req.body;
  console.log(query, type);
  console.log(req.body);
  //to do
  // detect if query is title, author or ISBN
  // isbn is a number
  // author is a string
  // title is a string

  // check if the method is title, author or ISBN or any
  // if method is any, search for all documents with title, author or ISBN matching the query
  // else search for documents with title, author or ISBN matching the query based on the method
  // use ILIKE for case-insensitive search

  
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
    case "Title":
      // search for all documents with title matching the query
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
                LEFT JOIN public."Book" b ON d.document_id = b.document_id
                LEFT JOIN public."DocumentAuthor" da ON d.document_id = da.document_id
                LEFT JOIN public."Author" a ON da.author_id = a.author_id
                WHERE d.title ILIKE $1
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
    case "Author":
      // search for Author matching the query
      // use ILIKE for case-insensitive search
      // get isbns from magazines
      // get authors from documentauthor and authors
      // combine results
      try {
        const searchQuery = `
                SELECT d.document_id, d.title,
                    m.isbn,
                    STRING_AGG(a.name, ', ') AS authors,
                    d.year AS year
                FROM public."Document" d
                LEFT JOIN public."Magazine" m ON d.document_id = m.document_id
                LEFT JOIN public."DocumentAuthor" da ON d.document_id = da.document_id
                LEFT JOIN public."Author" a ON da.author_id = a.author_id
                WHERE a.name ILIKE $1
                GROUP BY d.document_id, d.title, m.isbn, d.year
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
    case "ISBN":
      // search for ISBN matching the query
      // use ILIKE for case-insensitive search
      // get authors from documentauthor and authors
      // combine results
      const searchQuery = `
              SELECT d.document_id, d.title,
                  b.isbn,
                  STRING_AGG(a.name, ', ') AS authors,
                  d.year AS year
              FROM public."Document" d
              LEFT JOIN public."Book" b ON d.document_id = b.document_id
              LEFT JOIN public."DocumentAuthor" da ON d.document_id = da.document_id
              LEFT JOIN public."Author" a ON da.author_id = a.author_id
              WHERE b.isbn ILIKE $1
              GROUP BY d.document_id, d.title, b.isbn, d.year
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
  //this function is used to get the number of copies for a list of documents
  //it takes the documentIds as a parameter and returns the number of copies for each document
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
  //this function is used to create copies of a document
  //it takes the document_id and numCopies as parameters
  const { document_id, numCopies } = req.body;
  if (!document_id || numCopies <= 0) {
    return res.status(400).json({ success: false, message: "Invalid document ID or number of copies", });
  }
  console.log(document_id);
  try {
    //create copies of a document
    //if the copies are created successfully, return a success message
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
  //this function is used to create a lending record
  //it takes the document_id, client_email, lend_date and return_date as parameters
  const { document_id, client_email, lend_date, return_date } = req.body;
  if (!document_id || !client_email || !lend_date || !return_date) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }
  console.log(document_id);
  console.log(client_email);
  console.log(lend_date);
  console.log(return_date);
  try {
    // const existsQuery = `SELECT * FROM public."Lending" WHERE document_id = $1 AND client_email = $2`;
    //check if lending record already exists by matching document_id in DocumentCopy table and client_email in Lending table
    const existsQuery = `SELECT * FROM public."Lending" l JOIN public."DocumentCopy" dc ON l.copy_id = dc.copy_id WHERE dc.document_id = $1 AND l.client_email = $2`;
    const existsResult = await pool.query(existsQuery, [document_id, client_email]);

    console.log(existsResult.rows);

    if (existsResult.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Lending record already exists for this document and client.", });
    }

    // const insertQuery = `INSERT INTO public."Lending" (copy_id, client_email, lend_date, return_date) VALUES ($1, $2, $3, $4) RETURNING lending_id;`;
    //get a copy_id from DocumentCopy table that is not already lent out
    //and insert a new lending record with that copy_id
    const insertQuery = `WITH available_copies AS (SELECT copy_id FROM public."DocumentCopy" WHERE document_id = $1 AND copy_id NOT IN (SELECT copy_id FROM public."Lending" WHERE return_date > CURRENT_DATE)) INSERT INTO public."Lending" (copy_id, client_email, lend_date, return_date) SELECT copy_id, $2, $3, $4 FROM available_copies LIMIT 1 RETURNING lending_id;`;
    const result = await pool.query(insertQuery, [document_id, client_email, lend_date, return_date]);
    console.log(result.rows)
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
  //this function is used to get the active lendings
  //it returns the active lendings
  //if there are no active lendings, it returns a 404 status code
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
  //this function is used to get the lendings for a client
  //it takes the client_email as a parameter and returns the lendings for the client
  //if there are no lendings for the client, it returns a 404 status code
  //if there is a server error, it returns a 500 status code
  const { client_email } = req.params;
  try {
    const query = `SELECT l.lending_id, l.copy_id, l.lend_date, l.return_date, d.title, (CURRENT_DATE > l.return_date) AS is_overdue FROM public."Lending" l JOIN public."DocumentCopy" dc ON l.copy_id = dc.copy_id JOIN public."Document" d ON dc.document_id = d.document_id WHERE l.client_email = $1;`;
    const result = await pool.query(query, [client_email]);
    console.log(result);
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
  //this function is used to delete a lending record by id
  //it takes the lending_id as a parameter
  //it returns a success message if the lending record is deleted successfully
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
  //this function is used to delete a client by email
  //it takes the email as a parameter
  //it returns a success message if the client is deleted successfully
  //it returns an error message if the client is not deleted successfully
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
  //this function is used to add a credit card to a client
  //it takes the cardNumber and clientEmail as parameters
  //it returns a success message if the card is added successfully
    const { cardNumber, clientEmail } = req.body;
    if (!cardNumber || !clientEmail) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    console.log(cardNumber);
    console.log(clientEmail);
    try {
        const insertQuery = `INSERT INTO "CreditCards" (card_number, client_email) VALUES ($1, $2) RETURNING *;`;
        const result = await pool.query(insertQuery, [cardNumber, clientEmail]);
        console.log(result);
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
  //this function is used to get the credit cards for a client
  //it takes the email as a parameter and returns the credit cards for the client
  //if there are no credit cards for the client, it returns a 404 status code
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
  //this function is used to delete a credit card for a client
  //it takes the email and cardNumber as parameters
  //it returns a success message if the card is deleted successfully
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
  //this function is used to update a credit card for a client
  //it takes the email, oldCardNumber and newCardNumber as parameters
  //it returns a success message if the card is updated successfully
  const { email, oldCardNumber } = req.params;
  const { newCardNumber } = req.body;
  console.log(email);
  console.log(newCardNumber);
  console.log(oldCardNumber);
  if (!newCardNumber) {
      return res.status(400).json({ success: false, message: "New card number must be provided" });
  }

  try {
      const updateQuery = `
          UPDATE "CreditCards" 
          SET card_number = $1  
          WHERE client_email = $2 AND card_number = $3
          RETURNING *;
      `;
      const result = await pool.query(updateQuery, [newCardNumber, email, oldCardNumber]);
      console.log(result);
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
  //this function is used to check if a client has a credit card
  //it takes the email as a parameter and returns a boolean value indicating whether the client has a credit card
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

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBookList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/');
      return response.data;
    } catch (error) {
      console.error('Error fetching book list:', error.message);
      throw error;
    }
  };

    public_users.post("/register", (req, res) => {
        const {username, password } = req.body;
      
        if (!username || !password) {
          return res.status(400).json({ message: "Username and password are required" });
        }
      
        if (users.find(user => user.username === username)) {
          return res.status(409).json({ message: "Username already exists" });
        }
      
        // Assuming users is an array defined in auth_users.js
        users.push({username, password });
      
        return res.status(201).json({ message: "User registered successfully" });
      });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const bookList = Object.values(books); // Assuming 'books' is imported
    const formattedBookList = bookList.map(book => ({
      title: book.title,
      author: book.author,
    }));
    // Using JSON.stringify with indentation (2 spaces)
const formattedJson = JSON.stringify({ books: formattedBookList }, null, 2);
  
    return res.status(200).json({ books: formattedBookList });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  
    if (!isbn || !books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
  
    const bookDetails = {
      isbn: isbn,  // Include the ISBN in the response
      title: books[isbn].title,
      author: books[isbn].author,
      reviews: books[isbn].reviews || [],
    };
  
    // Using JSON.stringify with indentation (2 spaces)
    const formattedJson = JSON.stringify({ book: bookDetails }, null, 2);
  
    // Send the formatted JSON as the response
    return res.status(200).send(formattedJson);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
    const authorToSearch = req.params.author;
  
    if (!authorToSearch) {
      return res.status(400).json({ message: "Author not provided" });
    }
  
    const matchingBooks = [];
    Object.keys(books).forEach(isbn => {
      const book = books[isbn];
      if (book.author.toLowerCase() === authorToSearch.toLowerCase()) {
        matchingBooks.push({
          isbn: isbn,
          title: book.title,
          author: book.author,
          reviews: book.reviews || [],
        });
      }
    });
  
    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: "Books by the author not found" });
    }
  
    // Using JSON.stringify with indentation (2 spaces)
    const formattedJson = JSON.stringify({ books: matchingBooks }, null, 2);
  
    // Send the formatted JSON as the response
    return res.status(200).send(formattedJson);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleToSearch = req.params.title;
  
    if (!titleToSearch) {
      return res.status(400).json({ message: "Title not provided" });
    }
  
    const matchingBooks = [];
    Object.keys(books).forEach(isbn => {
      const book = books[isbn];
      if (book.title.toLowerCase() === titleToSearch.toLowerCase()) {
        matchingBooks.push({
          isbn: isbn,
          title: book.title,
          author: book.author,
          reviews: book.reviews || [],
        });
      }
    });
  
    if (matchingBooks.length === 0) {
      return res.status(404).json({ message: "Books with the title not found" });
    }
  
    // Using JSON.stringify with indentation (2 spaces)
    const formattedJson = JSON.stringify({ books: matchingBooks }, null, 2);
  
    // Send the formatted JSON as the response
    return res.status(200).send(formattedJson);
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  
    if (!isbn || !books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const bookReviews = books[isbn].reviews || [];
  
    // Using JSON.stringify with indentation (2 spaces)
    const formattedJson = JSON.stringify({ reviews: bookReviews }, null, 2);
  
    // Send the formatted JSON as the response
    return res.status(200).send(formattedJson);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

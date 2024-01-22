// auth_users.js

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Write code to check if the username is valid
  // ...
}

const authenticatedUser = (username, password) => {
    console.log('Checking user credentials:', username, password);
    const user = users.find(user => user.username === username && user.password === password);
    console.log('Found user:', user);
    return !!user;
}

// User registration
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Assuming users is an array defined in auth_users.js
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// User login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Authenticate user
    if (authenticatedUser(username, password)) {
      // Create JWT token
      const token = jwt.sign({ username }, 'jsonwebtoken'); // Replace 'your_secret_key' with your actual secret key
  
      // Set the token in the response header
      res.setHeader('Authorization', `Bearer ${token}`);
  
      return res.status(200).json({ message: "Login successful", token });
    }
  
    return res.status(401).json({ message: "Invalid credentials" });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const username = req.user; // Assuming you set the user in the session during login
  
    if (!isbn || !review || !username) {
      return res.status(400).json({ message: "ISBN, review, and username are required" });
    }
  
    // Check if the book with the provided ISBN exists
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has already reviewed this book
    if (book.reviews && book.reviews[username]) {
      // If the user already has a review, modify it
      book.reviews[username] = review;
      return res.status(200).json({ message: "Review modified successfully" });
    }
  
    // If the user has not reviewed this book before, add a new review
    if (!book.reviews) {
      book.reviews = {};
    }
    book.reviews[username] = review;
  
    return res.status(201).json({ message: "Review added successfully" });
  

  });
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.user; // Assuming you set the user in the session during login
  
    if (!isbn || !username) {
      return res.status(400).json({ message: "ISBN and username are required" });
    }
  
    // Check if the book with the provided ISBN exists
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has a review for this book
    if (book.reviews && book.reviews[username]) {
      // Delete the review
      delete book.reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    }
  
    return res.status(404).json({ message: "Review not found for the given user and ISBN" });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

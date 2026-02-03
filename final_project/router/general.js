const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // Send JSON response with formatted books data
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // Retrieve the ISBN parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = [];

    // Iterate over all books
    for (const key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push(books[key]);
        }
    }

    if (booksByAuthor.length > 0) {
        res.send(booksByAuthor);
    } else {
        res.status(404).json({message: "No books found by this author"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = [];

  // Iterate over all books
  for (const key in books) {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        booksByTitle.push(books[key]);
      }
  }

  if (booksByTitle.length > 0) {
      res.send(booksByTitle);
  } else {
      res.status(404).json({message: "No books found by this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // Retrieve the ISBN parameter from the request URL and send the corresponding book's review
  const isbn = req.params.isbn;
  const book = books[isbn];

  res.send(book.reviews);
w
});

module.exports.general = public_users;

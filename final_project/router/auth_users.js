const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
// Check if username already exists in users array
    return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!review) {
        return res.status(400).json({ message: "Review query parameter is required" });
    }

    const book = books[isbn];
    if (book) {
        if (!book.reviews) {
            book.reviews = {};
        }
        // Add or update the review by the current user
        book.reviews[username] = review;

        return res.status(200).json({
            message: "Review added/updated successfully",
            reviews: book.reviews
        });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization && req.session.authorization.username;

    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    const book = books[isbn];
    if (book) {
        if (book.reviews && book.reviews.hasOwnProperty(username)) {
            // Delete only the review by the logged-in user
            delete book.reviews[username];
            return res.status(200).json({
                message: "Your review has been deleted successfully",
                reviews: book.reviews
            });
        } else {
            return res.status(404).json({ message: "No review by you exists for this book" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

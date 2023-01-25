const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    let userswithsamename = users.filter((user) => user.username === username);
    if (userswithsamename.length > 0) {
      return res.status(404).json({ message: "User already exists!" });
    } else {
      users.push({ username: username, password: password });

      return res.status(200).json({
        message: "User successfully registred. Now you can login",
      });
      // res.send("The user" + " " + req.query.firstName + " Has been added!");
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const filteredBook = Object.values(books).filter((book) =>
    book.author.includes(author)
  );
  res.send(filteredBook);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const filteredBook = Object.values(books).filter((book) =>
    book.title.includes(title)
  );
  res.send(filteredBook);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;

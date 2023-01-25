const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "user1", password: "123" },
  { username: "user2", password: "123" },
  { username: "user3", password: "123" },
];

const isValid = (username) => {
  return users.filter((user) => user.username === username).length > 0;
};

const authenticatedUser = (username, password) => {
  return (
    users.filter(
      (user) => user.username === username && user.password === password
    ).length > 0
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.body.review;
  books[isbn].reviews[username] = review;
  res.send(books[isbn].reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  delete books[isbn].reviews[username];
  res.send(books[isbn].reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

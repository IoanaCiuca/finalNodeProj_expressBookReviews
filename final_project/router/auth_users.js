const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in. Please provide valid username and/or password."});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if(book) {
    let review = req.body.review;
    if(review) {
      book["reviews"] = review;
    }
    books[isbn] = book;
    res.send(`The book with isbn ${isbn} has been udated.`)
  }
  else {
    res.send("Unable to find book.");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const session_username = req.session.username;
  let books_array = Object.keys(books);
  books_array = books_array.filter((book) => (book.isbn != isbn && session_username != req.body.username));
  res.send(`Book with the isbn  ${isbn} has been deleted.`);
  /*let remaining_books = [];
  for(const i in books) {
    if(books[i].isbn != isbn && session_username != req.body.username) {
      remaining_books.push(books[i]);
    }
  }
  if(remaining_books) {
    res.send(remaining_books);
    return;
  }
  return res.status(404).json({message: "Nothing to be deleted."});*/
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

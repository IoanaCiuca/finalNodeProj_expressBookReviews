const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios').default;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. Please provide valid username and password."});
});

async function wait (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  });
}

// Get the book list using async/await
public_users.get('/', async function(req, res){
  await wait(5 * 1000);
  res.send(JSON.stringify({books},null,4));
});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));
});*/

// Get the book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  await wait(5 * 1000);
  res.send(books[isbn]);
 });
// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });*/
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let books_author = [];
  for(const i in books) {
    if(books[i].author === author) {
      books_author.push(books[i]);
    }
  }
  if(books_author) {
    res.send(books_author);
    return;
  }
  return res.status(404).json({message: "Not found"});
});

// Get all books based on title using async/await
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  await wait(5 * 1000);
  let books_title = [];
  for(const i in books) {
    if(books[i].title === title) {
      books_title.push(books[i]);
    }
  }
  if(books_title) {
    res.send(books_title);
    return;
  }
  return res.status(404).json({message: "Not found"});
});

// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let books_title = [];
  for(const i in books) {
    if(books[i].title === title) {
      books_title.push(books[i]);
    }
  }
  if(books_title) {
    res.send(books_title);
    return;
  }
  return res.status(404).json({message: "Not found"});
});*/

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;

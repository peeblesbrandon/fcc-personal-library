/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const Book = require('../models/Book.js');
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, '_id title commentcount', (err, books) => {
        if (err) {
          return res.status(500).json({ error: 'could not fetch book list', errorDescription: err });
        } else {  
          console.log(books);
          return res.status(200).json(books);
        }
      })
    })
    
    .post(function (req, res){
      if (!req.body.title || req.body.title == '') {
        return res.status(400).send('title cannot be empty');
      }
      const newBook = new Book({
        title: req.body.title
      });
      newBook.save()
        .then(result => {
          console.log(result);
          res.status(201).json(result);
        })
        .catch(err => {
          return res.status(500).json({ error: 'could not create new book', errorDescription: err });
        });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'could not perform complete delete', errorDescription: err });
        } else {
          return res.status(200).send('complete delete successful');
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById({ _id: bookid }, (err, book) => {
        if (err) {
          return res.status(500).send('no book exists');
        } else {
          return res.status(200).json(book);
        }
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      Book.findByIdAndUpdate({ _id: bookid }, {
        $push: { comments: comment },
        $inc: {'commentcount': 1 }
      }, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'could not post comment', errorDescription: err });
        } else {
          return res.status(200).json(result);
        }
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteOne({ _id: bookid }, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'could not delete book', errorDescription: err });
        } else {
          return res.status(200).send('delete successful');
        }
      });
    });
  
};

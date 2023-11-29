// Create web server

var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Post = require('../models/post');

// Get all comments
router.get('/', function(req, res, next) {
    Comment.find(function(err, comments) {
        if (err) { return next(err); }

        res.json(comments);
    });
});

// Create new comment
router.post('/', function(req, res, next) {
    var comment = new Comment(req.body);

    comment.save(function(err, comment) {
        if (err) { return next(err); }

        res.json(comment);
    });
});

// Middleware to load comment by id
router.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function(err, comment) {
        if (err) { return next(err); }
        if (!comment) { return next(new Error('Can\'t find comment')); }

        req.comment = comment;
        return next();
    });
});

// Get comment by id
router.get('/:comment', function(req, res, next) {
    res.json(req.comment);
});

// Update comment by id
router.put('/:comment/upvote', function(req, res, next) {
    req.comment.upvote(function(err, comment) {
        if (err) { return next(err); }

        res.json(comment);
    });
});

// Delete comment by id
router.delete('/:comment', function(req, res, next) {
    req.comment.remove(function(err, comment) {
        if (err) { return next(err); }

        res.json(comment);
    });
});

// Get all comments for a post
router.get('/post/:post', function(req, res, next) {
    var query = Comment.find({post: req.post._id});

    query.exec(function(err, comments) {
        if (err) { return next(err); }

        res.json(comments);
    });
});

// Middleware to load post by id
router.param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function(err, post) {
        if (err) { return next(err); }
        if (!post) { return next(new Error('Can\'t find post')); }

        req.post = post;
        return next();
    });
});

module.exports = router;
const express = require('express');
const { body } = require('express-validator');

const blogController = require('../controllers/blog');

const router = express.Router();


// GET /blog/feed
router.get('/feed', blogController.getFeed);

// POST /blog/create 
router.post('/create',
[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5}),

],
 blogController.createBlogs);

 router.get('/:blogId', blogController.getBlog);

module.exports = router;
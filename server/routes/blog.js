const express = require('express');
const { body } = require('express-validator');

const blogController = require('../controllers/blog');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


// GET /blog/feed
router.get('/feed', blogController.getFeed);

// POST /blog/create 
router.post('/create', isAuth,
[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5}),

],
 blogController.createBlogs);

 router.get('/:blogId', blogController.getBlog);

 router.put('/edit/:blogId',
 [
     body('title').trim().isLength({min:5}),
     body('content').trim().isLength({min:5}),
 
 ],
 blogController.updateBlog);

 router.delete('/delete/:blogId', blogController.deleteBlog);

module.exports = router;
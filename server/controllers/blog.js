const {validationResult} = require('express-validator');

const Blog = require('../models/blogs');

exports.getFeed = (req, res, next) => {
    Blog.find()
        .then( feed => {
            res.status(200).json({blogs:feed})
        }
            
        )
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
  
};

exports.createBlogs = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    };
    if(!req.file){
        const error = new Error('File not provided');
        error.statusCode = 422;
        throw error;
    };
    
    const title = req.body.title;
    const subTitle = req.body.subTitle;
    const imagePath = req.file.path;
    const category = req.body.category;
    const content = req.body.content;
    
    // store in DB
    const blog = new Blog({
        title:title, 
        subtitle:subTitle,
        imagePath:imagePath,
        category:category,
        content:content
    });
    blog
    .save()
    .then( result => {
        console.log(result);
        res.status(201).json({
            message:"post created successfully",
            posts: result
        }) 
    } )
    .catch(
        err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        }
         );
     

}

exports.getBlog = (req, res, next) => {
    const blogId = req.params.blogId;
    Blog.findById(blogId)
        .then(blog => {
            if(!blog){
               const err =  new Error('Blog does\'nt exist');
               err.statusCode = 404;
                throw err;
            };
            res.status(200).json({blog:blog})
        })
        .catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        } )
}
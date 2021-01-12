const fileSystem = require('fs');
const path = require('path');

const {validationResult} = require('express-validator');

const Blog = require('../models/blogs');
const User = require('../models/user');

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
    let creator;
    
    
    // store in DB
    const blog = new Blog({
        title:title, 
        subtitle:subTitle,
        imagePath:imagePath,
        category:category,
        content:content,
        creator: req.userId,
    });
    blog
    .save()
    .then( result => {
        return User.findById(req.userId);
    })
    .then(user => {
        creator = user;
        user.blogs.push(blog);
        return user.save();
       
    })
    .then(result => {
        res.status(201).json({
            message:"post created successfully",
            blogs: blog ,
            creator:{_id: creator._id, name: creator.fname}
        });
    })    
  
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
            res.status(200).json({message:"blog fetched", blog:blog})
        })
        .catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        } )
}

exports.updateBlog = (req, res, next) => {
    const blogId = req.params.blogId;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed');
        error.statusCode = 422;
        throw error;
    };
    const title = req.body.title;
    const subTitle = req.body.subTitle;
    const content = req.body.content;
    const category = req.body.category;
    let imagePath = req.body.imagePath;
    if(req.file){
        imagePath= req.file.path;
    }
    if(!imagePath){
        const error = new Error('No file picked');
        error.statusCode = 422;
        throw error;

    }
    Blog.findById(blogId)
        .then(blog => {
            if(!blog){
               const err =  new Error('Could not find blog');
               err.statusCode = 404;
                throw err;
            };
            if(blog.creator.toString() !== req.userId){
               const error = new Error('User not authorized');
               error.statusCode = 403;
               throw error;
            }
            if(imagePath !== blog.imagePath){
                clearImage(blog.imagePath);
            }
            blog.title = title;
            blog.subTitle = subTitle;
            blog.content = content;
            blog.category = category;
            blog.imagePath = imagePath;
            return blog.save();
        })
        .then(result => {
            res.status(200).json({message: 'Blog Updated', blog: result})
        })
        .catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        } )
}

exports.deleteBlog = (req, res, next) => {
   const blogId = req.params.blogId;
   Blog.findById(blogId)
   .then( blog => {
       if(!blog){
               const err =  new Error('Could not find blog');
               err.statusCode = 404;
                throw err;
            };
            if(blog.creator.toString() !== req.userId){
                const error = new Error('User not authorized');
                error.statusCode = 403;
                throw error;
             }
            // check logged in user
            clearImage(blog.imagePath);
            return Blog.findByIdAndRemove(blogId);
   })
   .then( result => {
      return User.findById(req.userId);
   })
   .then(user => {
       user.blogs.pull(blogId);
       return user.save();
   })
   .then(result => {
       res.status(200).json({message:'Deleted'})
   })
   .catch( err => {
    if(!err.statusCode){
        err.statusCode = 500;
    }
    next(err);
} );

} 

const clearImage = filePath => {
     filePath = path.join(__dirname, '..', filePath );
     fileSystem.unlink(filePath, err => console.log(err));
}
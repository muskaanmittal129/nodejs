const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const blogRoutes = require('./routes/blog')

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    },
    
});

const fileFilter = (req, file, cb) => {
    if( 
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
        ){
            cb(null, true);
        } else{
            cb(null, false);
        }
};

app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('imagePath'));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use( (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
});
app.use('/blog', blogRoutes);

app.use( (error, req, res, next) => {
    console.log(error);
   const status =  error.statusCode || 500;
   const message = error.message;
   console.log(message);
   res.status(status).json({message:message});

} )

mongoose
.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.hiedf.mongodb.net/${process.env.MONGO_DEFAULT_DB}?retryWrites=true&w=majority`,
     {useNewUrlParser: true, useUnifiedTopology: true}
    )
.then(result => app.listen(8080) )
.catch(err => console.log(err))


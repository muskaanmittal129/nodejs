const User = require('../models/user');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email:email,
                password:hashedPw,
                fname:fname,
                lname:lname,
                username:username,
                confirmPassword:confirmPassword
            });
            return user.save();
        })
        .then(result => {
            console.log(result)
            res.status(201).json({message: 'User created', userId: result._id})
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });

  
};

exports.signin = (req, res, next) => {
   const username =  req.body.username;
   const password = req.body.password;
   let loadedUser;
   User.findOne({username:username})
        .then(user => {
            if(!user){
                const error = new Error('User with this username could not be found');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
           return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if(!isEqual){
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    username:loadedUser.username, 
                    userId: loadedUser._id.toString()
                },
                'somesupersupersecret', 
                { expiresIn: '1h'}
                );
                res.status(200).json({token: token, userId: loadedUser._id.toString() })
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
};
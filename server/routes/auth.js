const express = require('express');
const {body} = require('express-validator');

const User = require('../models/user');
const authcontroller = require('../controllers/auth');

const router = express.Router();

router.put('/signup',
    body('email')
        .isEmail()
        .withMessage('Please provide email')
        .custom( (value, { req }) => {
            return User.findOne( {email: value}).then(userDoc => {
                if(userDoc){
                    return Promise.reject('Email already exists');
                }
            });
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min:8}),
    body('fname')
        .trim()
        .not()
        .isEmpty(),
    authcontroller.signup    
);

router.post('/signin', authcontroller.signin);

module.exports = router;

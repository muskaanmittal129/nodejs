const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    email:{
        type: String,
        required:true
    },
    password:{
        type:String,
        required: true
    },
    confirmPassword:{
        type:String,
        required: true
    },
    status:{
        type:String,
        default:'I am new'
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: false
    },
    username:{
        type: String,
        required: true
    },
    blogs: [{
        type: schema.Types.ObjectId,
        ref: 'Blog'
    }]
});

module.exports = mongoose.model('User', userSchema)

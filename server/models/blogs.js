const mongoose = require('mongoose');

const schema  = mongoose.Schema;

const blogSchema = new schema({
    title:{
        type:String,
        required:true
    },
    subTitle:{
        type:String,
        required:false,
    },
    imagePath:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    creator:{
        type: schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},
{timestamps:true,}
);

module.exports = mongoose.model('Blog', blogSchema);

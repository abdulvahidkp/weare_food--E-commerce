const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        lowercase:true,
        unique:true,
    },
    password: {
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        maxlength:11,
        minlength:9
    },
    gender: {
        type: String,
        enum: ["male","female","other"]
    },
    blockStatus:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,    
        default:()=>Date.now(),
        immutable:true  
    }
})

module.exports = mongoose.model('users', userSchema)
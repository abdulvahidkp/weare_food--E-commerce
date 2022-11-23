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
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
    updatedAt:{
        type:Date,    
        default:()=>Date.now()
    }
})

module.exports = mongoose.model('users', userSchema)
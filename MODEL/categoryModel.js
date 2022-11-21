const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:true,
        unique:true,
    },
    imagePath:String,
    status:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model('categories',categorySchema)
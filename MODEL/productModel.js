const mongoose = require('mongoose')
const categorySchema = require('./categoryModel')

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    productCategory: {
        type: String,
        required: true,
        trim: true
    },
    productStock: {
        type: Number,
        required: true,
        trim: true
    },
    productPrice: {
        type: Number,
        required: true,
        trim: true,
    },
    productSellingPrice: {
        type: Number,
        trim: true
    },
    productDescription: {
        type: String,
        required: true,
        trim: true
    },
    image: []
})


module.exports = mongoose.model('products', productSchema);
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    productCategory: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'categories'
    },
    productStock: {
        type: Number,
        required: true,
        trim: true
    },
    productPrice: {
        type: Number,
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
    productStatus:{
        type:Boolean,
        default:true
    },
    image: []
})


module.exports = mongoose.model('products', productSchema);
const mongoose = require('mongoose')
const products = require('mongoose')

const cartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    },
    cartItems: [{
        productId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'products'
        },
        quantity: Number
    }],
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('carts', cartSchema)
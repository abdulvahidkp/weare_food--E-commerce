const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    },
    orderDetails: [{
        paymentMethod: String,
        address: {
            name: String,
            mobile: Number,
            houseName: String,
            district: String,
            state: String,
            pincode: Number
        },
        orderItems: [{
            productId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'products'
            },
            quantity: Number
        }],
        total: Number,
        createdAt: {
            type: Date,
            default: new Date(),
            immutable: true
        },
        status: {
            type: String,
            default: 'placed order'
        }
    }]
})


module.exports = mongoose.model('orders', orderSchema)
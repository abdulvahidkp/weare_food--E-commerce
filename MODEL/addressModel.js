const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    },
    address: [{
        name: String,
        mobile: Number,
        houseName: String,
        district: String,
        state: String,
        pincode: Number
    }]
})

module.exports = mongoose.model('addresses',addressSchema)
const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    userId:ObjectId,
    productId:ObjectId
})

module.exports = mongoose.model('wishlists',wishlistSchema)
const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
    mainHead:String,
    subHead:String,
    paragraph:String,
    imagePath:String
})

module.exports = mongoose.model('banners',bannerSchema)
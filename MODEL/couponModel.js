const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
        code:{
            type:String,
            required:true,
            unique:true,
            uppercase:true
        },
        percentage:{
            type:Number,
            required:true,
            max:100
        },
        status:{
            type:Boolean,
            default:true
        }
})

module.exports = mongoose.model('coupons',couponSchema)
const users = require('../../MODEL/userModel')
const products = require('../../MODEL/productModel')
const wishlist = require('../../MODEL/wishlistModel')
const mongoose = require('mongoose')
msg = ''

module.exports = {

    getWishlist: async (req, res) => {
        const { userId } = req.session
        let wishCount = await wishlist.find({ userId }).count()

        if (wishCount == 0) {
            msg = 'Your wishlist is empty'
        }

        let wishlistList = await wishlist.findOne({ userId }).populate('productId').lean()
        let productsList = wishlistList.productId
        res.render('user/wishlist', { user: true, productsList, msg })
        msg = ''
    },
    addWishlist: async (req, res) => {
        console.log('---------------------------------');
        const id = req.session.userId
        let proId = mongoose.Types.ObjectId(req.body.proId).toString()
        console.log(id);
        console.log(proId);
        const existWishlist = await wishlist.findOne({ userId: id })
        if (existWishlist) {
            console.log('exist wishlist');
            let products = existWishlist.productId
            let existsProduct = products.includes(proId, 0)
            if (existsProduct) {
                console.log('product already exist so removed');
                await wishlist.updateOne({ userId: id }, { $pull: { productId: proId } }).then((response) => {
                    res.json(response)
                })
            } else {
                console.log('product added to existing document');
                await wishlist.updateOne({ userId: id }, { $push: { productId: proId } }).then((response)=>{
                    res.json(response)
                })
            }
        } else {
            console.log('new wishlist');
            await wishlist.create({ userId: id, productId: proId }).then((response)=>{
                res.json(response)
            })
        }
    }

}
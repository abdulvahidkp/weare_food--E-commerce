const users = require('../../MODEL/userModel')
const products = require('../../MODEL/productModel')
const wishlist = require('../../MODEL/wishlistModel')
let carts = require('../../MODEL/cartModel')
const mongoose = require('mongoose')
msg = ''

module.exports = {

    getWishlist: async (req, res) => {
        const { userId } = req.session
        let wishCount = await wishlist.find({ userId }).count()

        let products = await carts.findOne({userId:userId}).populate('cartItems.productId').lean()
        let countCart = 0;
        if(products){
            let productDetail = products.cartItems
            productDetail.forEach(element => {
              countCart += element.quantity;
            });
        }   

        if (wishCount == 0) {
            msg = 'Your wishlist is empty'
            res.render('user/wishlist', { user: true, msg ,userLogin:true,countCart})
            msg = ''
        } else{
            let wishlistList = await wishlist.findOne({ userId }).populate('productId').lean()
            let productsList = wishlistList.productId 
            res.render('user/wishlist', { user: true, productsList,userLogin:true,countCart})
        }
    },
    addWishlist: async (req, res) => {
        const id = req.session.userId
        let proId = mongoose.Types.ObjectId(req.body.proId).toString()
        const existWishlist = await wishlist.findOne({ userId: id })
        if (existWishlist) {
            let products = existWishlist.productId
            let existsProduct = products.includes(proId, 0)
            if (existsProduct) {
                await wishlist.updateOne({ userId: id }, { $pull: { productId: proId } }).then((response) => {
                    res.json(response)
                })
            } else {
                await wishlist.updateOne({ userId: id }, { $push: { productId: proId } }).then((response)=>{
                    res.json(response)
                }) 
            }
        } else {
            await wishlist.create({ userId: id, productId: proId }).then((response)=>{
                res.json(response)
            })
        }
    }

}
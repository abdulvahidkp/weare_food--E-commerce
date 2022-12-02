const products = require('../../MODEL/productModel')
let carts = require('../../MODEL/cartModel')
const orders = require('../../MODEL/orderModel')
module.exports = {
    getProduct: async (req, res) => {
        let proId = req.params.id
        let productDetails = await products.findById(proId).populate('productCategory').lean()
        if (req.session.userId) {
            let userId = req.session.userId
            let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
            let countCart = 0;
            if (products) {
                let productDetail = products.cartItems
                productDetail.forEach(element => {
                    countCart += element.quantity;
                });
            }
            res.render('user/singleProduct', { user: true, data: productDetails, userLogin: true, userShop: true, countCart })
        } else {
            res.render('user/singleProduct', { user: true, data: productDetails, userShop: true })
        }
    },
    getContact: async (req, res) => {
        if(req.session.userId){
            let userId = req.session.userId
            let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
            let countCart = 0;
            if (products) {
                let productDetail = products.cartItems
                productDetail.forEach(element => {
                    countCart += element.quantity;
                });
            }
            res.render('user/contact', { user: true, userContact: true, countCart,userLogin: true })

        }else{
            res.render('user/contact',{user:true,userContact:true})
        }
    },
    getUserProfile: async (req, res) => {
        let userId = req.session.userId
        let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
        let countCart = 0;
        if (products) {
            let productDetail = products.cartItems
            productDetail.forEach(element => {
                countCart += element.quantity;
            });
        }
        res.render('user/myProfile', { user: true, countCart ,userLogin: true})
    },
    getChangePass: (req, res) => {
        res.render('user/changePass')
    },
   
}
const products = require('../../MODEL/productModel')
let carts = require('../../MODEL/cartModel')
let users = require('../../MODEL/userModel')
let addresses = require('../../MODEL/addressModel')
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
            res.render('user/contact', { user: true, userContact: true, countCart, userLogin: true })

        } else {
            res.render('user/contact', { user: true, userContact: true })
        }
    },
    getUserProfile: async (req, res) => {
        let userId = req.session.userId
        let address = await addresses.findOne({ userId: userId }).lean()
        if(address){
            address = address.address
        }
        let user = await users.findOne({ _id: userId }).lean()
        let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
        let countCart = 0;
        if (products) {
            let productDetail = products.cartItems
            productDetail.forEach(element => {
                countCart += element.quantity;
            });
        }
        res.render('user/myProfile', { user: true, countCart, userLogin: true, user, data: address })
    },
    editUserProfile: async (req, res) => {
        let userId = req.session.userId
        let { name, mobile, gender } = req.body
        await users.updateOne({ _id: userId }, { name, mobile, gender }).then((response) => {
            res.redirect('/userProfile')
        })

    },
    addNewAddress: async (req, res) => {
        let userId = req.session.userId
        const { name, mobile, houseName, district, state, pincode, total } = req.body

        await addresses.findOne({ userId: userId }).then(async (response) => {
            if (response) {
                await addresses.updateOne({ userId }, { $push: { address: { name, mobile, houseName, district, state, pincode } } }).then((response) => {
                })
            } else {
                await addresses.create({ userId: userId, address: { name, mobile, houseName, district, state, pincode } })
            }

            res.redirect('/userProfile')
        })
    },
    addressDelete: async (req, res) => {
        let userId = req.session.userId
        let addressId = req.params.id
        console.log(addressId);
        let a = await addresses.updateOne({ userId: userId }, { $pull: { address: { _id: addressId } } })
        console.log(a);
        res.redirect('/userProfile')
    },
    getChangePass: (req, res) => {
        res.render('user/changePass')
    },

}
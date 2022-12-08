let carts = require('../../MODEL/cartModel')
let products = require('../../MODEL/productModel')
let mongoose = require('mongoose')


module.exports = {
    cartPage: async (req, res) => {
        let shippingCost = 0;
        let userId = req.session.userId
        let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
        if (products) {
            let productDetails = products.cartItems;
            let totalCartPrice = 0;
                let countCart = 0
                productDetails.forEach(element => {
                    totalCartPrice += (element.productId.productSellingPrice * element.quantity)
                    countCart += element.quantity;
                });
                if(totalCartPrice>1000){
                    shippingCost = 50
                    total = totalCartPrice + shippingCost
                }
            res.render('user/cart', { user: true, productDetails, userLogin: true, countCart ,totalCartPrice,})
        } else {
            res.render('user/cart', { user: true, userLogin: true })
        }
    },

    addToCart: async (req, res) => {
        let userId = req.session.userId
        let proId = req.params.id
        console.log('proId',proId)
        let cartExist = await carts.findOne({ userId: userId })
        if (cartExist) {
            let products = cartExist.cartItems
            add(products, proId)
            async function add(products, proId) {
                const productExist = products.some(el => el.productId == proId);
                if (!productExist) {
                    await carts.updateOne({ userId: userId }, { $push: { cartItems: { productId: proId, quantity: 1 } } })
                    console.log('product not exist in cart. so new created');
                    res.json({ status: true })
                } else {
                    await carts.updateOne({ userId: userId, 'cartItems.productId': proId }, { $inc: { 'cartItems.$.quantity': 1 } })
                    res.json({ status: true })
                }
            }
        } else {
            await carts.create({ userId: userId, cartItems: { productId: proId, quantity: 1 } })
            res.json({ status: true })
        }
    },
    changeQuantity: async (req, res) => {
        let userId = req.session.userId
        let proId = req.body.proId
        let count = parseInt(req.body.count)
        await carts.updateOne({ userId: userId, 'cartItems.productId': proId }, { $inc: { 'cartItems.$.quantity': count } })
        res.json({ status: true })
    },
    removeFromCart: async (req, res) => {
        let proId = req.body.proId
        let userId = req.session.userId
        await carts.updateOne({ userId: userId }, { $pull: { cartItems:{productId: proId }}}).then((response) => {
            console.log(response);
            return res.json({ status: true })
        })
    }
}





// let products = cartExist.cartItems
// let proIds = products.filter(x=>{
//     return x.productId
// })
// console.log(proIds);
// let existsProduct = proIds.includes(proId, 0)
//     console.log(existsProduct);
//     if(existsProduct){
//         await carts.updateOne({userId:userId},{'cartItems.$.quantity':1}).then((response)=>{
//             console.log(response);
//             res.json({status:true})
//         }) 
//     }else{
//         await carts.updateOne({userId:userId},{$push:{cartItems:{productId:proId,quantity:1}}})
//         console.log('product not exist in cart. so new created');
//         res.json({status:true})
//     }
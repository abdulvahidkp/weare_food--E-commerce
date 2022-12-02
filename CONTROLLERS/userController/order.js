const carts = require('../../MODEL/cartModel')
const orders = require('../../MODEL/orderModel')

module.exports = {
    getOrderDetails: async (req, res) => {
        let userId = req.session.userId
        let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
        let countCart = 0;
        if (products) {
            let productDetail = products.cartItems
            productDetail.forEach(element => {
                countCart += element.quantity;
            });
        }
        let userOrders = await orders.findOne({userId:userId}).lean()
        let orderDetails = userOrders.orderDetails;
        orderDetails.forEach(e=>{
            date = e.createdAt
            e.date = date.toDateString()
        })
        res.render('user/orderDetails', { user: true, userOrder: true, countCart ,userLogin: true,orderDetails})
    },
    getSingleOrderDetails:async (req,res)=>{
        let userId = req.session.userId
        let orderId = req.params.id
        let order = await orders.findOne({userId:userId},{orderDetails:{$elemMatch:{_id:orderId}}}).populate('orderDetails.orderItems.productId').lean()
        console.log(order);        
        let orderedProducts = order.orderDetails[0].orderItems

        let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
        let countCart = 0;
        if (products) {
            let productDetail = products.cartItems
            productDetail.forEach(element => {
                countCart += element.quantity;
            });
        }
        res.render('user/singleOrderDetails', { user: true, userOrder: true, countCart ,userLogin: true,orderedProducts})
    }
}
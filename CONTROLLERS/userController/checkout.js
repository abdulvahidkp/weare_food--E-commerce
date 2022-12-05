const carts = require('../../MODEL/cartModel')
const addresses = require('../../MODEL/addressModel')
const orders = require('../../MODEL/orderModel')
const Razorpay = require('razorpay');
const { rejects } = require('assert');

let total;

var razorpayInstance = new Razorpay({
    key_id: 'rzp_test_byX4xjQdkJOyzX',
    key_secret: 'GwkQn36GPCizkzfcgmLcsFBN',
});


module.exports = {
    checkoutPagePost: async (req, res) => {
        total = req.body.total
        res.json({ status: true })
    },
    checkoutPage: async (req, res) => {
        let userId = req.session.userId
        let addresss = await addresses.findOne({ userId: userId }).lean()
        if (addresss) {
            let addressdata = addresss.address
            let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
            let countCart = 0;
            if (products) {
                let productDetail = products.cartItems
                productDetail.forEach(element => {
                    countCart += element.quantity;
                });
            }
            res.render('user/checkout', { countCart, user: true, data: addressdata, total })
        } else {
            let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
            let countCart = 0;
            if (products) {
                let productDetail = products.cartItems
                productDetail.forEach(element => {
                    countCart += element.quantity;
                });
            }
            res.render('user/checkout', { countCart, user: true, total, userLogin: true })

        }
    },

    addressAdd: async (req, res) => {
        let userId = req.session.userId
        const { name, mobile, houseName, district, state, pincode, total } = req.body

        await addresses.findOne({ userId: userId }).then(async (response) => {
            if (response) {
                await addresses.updateOne({ userId }, { $push: { address: { name, mobile, houseName, district, state, pincode } } }).then((response) => {
                })
            } else {
                await addresses.create({ userId: userId, address: { name, mobile, houseName, district, state, pincode } })
            }

            res.redirect('/checkout')
        })
    },
    placeOrder: async (req, res) => {
        let userId = req.session.userId;
        let { paymentMethod, address, total } = req.body
        if (!req.body.address || !req.body.paymentMethod) {
            res.json({ address: false, paymentMethod: false })
        } else {
            let status = paymentMethod === 'COD' ? 'placed' : 'pending'
            if (status === 'placed') {
                let addressss = await addresses.findOne({ userId: userId }, { address: { $elemMatch: { _id: address } } });
                addressss = addressss.address[0]
                let cartId = await carts.findOne({ userId: userId }, { 'cartItems._id': 0 })
                cartDetails = cartId.cartItems
                let order = await orders.findOne({ userId: userId })
                if (order) {
                    await orders.updateOne({ userId: userId }, { $push: { orderDetails: { paymentMethod, address: addressss, orderItems: cartDetails, total } } })
                } else {
                    await orders.create({ userId: userId, orderDetails: { paymentMethod, address: addressss, orderItems: cartDetails, total } })
                }
                await carts.deleteOne({ userId: userId })
                res.json({ codSuccess: true })
            } else {
                let addressss = await addresses.findOne({ userId: userId }, { address: { $elemMatch: { _id: address } } });
                addressss = addressss.address[0]
                let cartId = await carts.findOne({ userId: userId }, { 'cartItems._id': 0 })
                cartDetails = cartId.cartItems
                let orderr = await orders.findOne({ userId: userId })
                if (orderr) {
                    await orders.updateOne({ userId: userId }, { $push: { orderDetails: { paymentMethod, address: addressss, orderItems: cartDetails, total,status } } })
                } else {
                    await orders.create({ userId: userId, orderDetails: { paymentMethod, address: addressss, orderItems: cartDetails, total ,status} })
                }
                await carts.deleteOne({ userId: userId })
                let order = await orders.findOne({ userId: userId }, { orderDetails: { $slice: -1 } }).lean()
                let options = {
                    amount: total * 100,
                    currency: 'INR',
                    receipt: '' + order.orderDetails[0]._id
                }
                razorpayInstance.orders.create(options,
                    (err, order) => {
                        if (!err)
                            res.json(order)
                        else
                            res.send(err);
                    }
                )
            }
        }
    },
    onlinePaymentVerify: async (req, res) => {
        let details = req.body
        console.log(req.body)
        const crypto = require('crypto')
        let hmac = crypto.createHmac('sha256', 'GwkQn36GPCizkzfcgmLcsFBN')

        hmac.update(details.payment.razorpay_order_id + '|' + details.payment.razorpay_payment_id)
        hmac = hmac.digest('hex')
        if (hmac == details.payment.razorpay_signature) {
            console.log('payment successss');
            await orders.updateOne({orderDetails:{$elemMatch:{_id:details.order.receipt}}},{'orderDetails.$.status':'placed order'})
            res.json({ status: true })
        } else {
            res.json({ status: false })
        }
    },
    orderConfirmation: async (req, res) => {
        userId = req.session.userId
        let order = await orders.findOne({ userId: userId }, { orderDetails: { $slice: -1 } }).lean()
        let orderDetails = order.orderDetails[0]
        let address = orderDetails.address
        let date = orderDetails.createdAt
        date = date.toDateString()

        let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
        let countCart = 0;
        if (products) {
            let productDetail = products.cartItems
            productDetail.forEach(element => {
                countCart += element.quantity;
            });
        }
        res.render('user/confirmation', { user: true, countCart, userLogin: true, address, orderDetails, date })
    },
}


// generated_signature = hmac_sha256(order_id + "|" + razorpay_payment_id, secret);
// if(generated_signature == razorpay_signature){
//     payment successful
// }


                // addressDelete: async (req, res) => {
                //     let userId = req.session.user
                //     let addressId = req.params.addressId
                //     let sttatus = await addresses.updateOne({ userId: userId, 'address._id': addressId }, { $set: { 'address.deleted': true } })
                //     console.log(sttatus)
                //     res.redirect('/checkout')
                // },
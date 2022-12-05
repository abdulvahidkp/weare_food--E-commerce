const admins = require('../../MODEL/adminModel')
const bcrypt = require('bcrypt')
const categories = require('../../MODEL/categoryModel')
const products = require('../../MODEL/productModel')
const users = require('../../MODEL/userModel')
const orders = require('../../MODEL/orderModel')
const catergory = require('../userController/catergory')
let message = ''

module.exports = {
    loginGet: (req, res) => {
        if (req.session.admin) {
            res.redirect('/admin/home')
        }else{
            res.render('admin/login', { message })
            message = ''
        }
       
    },
    loginPost: async (req, res) => {
        let userDetails =  req.body
            const admin = await admins.findOne({ email: userDetails.email })
            if (admin) {
                let status = await bcrypt.compare(userDetails.password, admin.password)
                if (status) {  
                    req.session.admin = userDetails.email
                    console.log('login success');
                    res.redirect('/admin/home')
                }
                else {
                    console.log('password incorrect');
                    message = 'invalid username or password'
                    res.redirect('/admin')
                }
            } else {
                console.log('invalid username');
                message = 'invalid username or password'
                res.redirect('/admin')
            }
       
    },
    logout:async(req,res)=>{
        req.session.admin = null
        res.redirect('/admin');
    },
    homeGet: async (req, res) => {
        const categoryCount = await categories.find().count()
        const productCount = await products.find().count()
        const userCount = await users.find().count()

        const hell = await orders.aggregate([
            {
                $project: {
                    orderDetails: {
                        $filter: {
                            input: '$orderDetails',
                            as: 'orderDetails',
                            cond: {}
                        },
                    },
                    _id: 0,
                },
            },
        ])

        // console.log(hell[0].orderDetails[0]);
        
        let orderCount= 0;

        let pendingCount = 0;
        let placeOrderCount = 0;
        let packedCount = 0;
        let shippedCount = 0;
        let deliveredCount = 0;
        let cancelledCount = 0;


        if(hell){
            hell.forEach((e)=>{
                orderCount += e.orderDetails.length
                e.orderDetails.forEach((f)=>{
                    if(f.status === 'placed order')placeOrderCount += 1
                    else if(f.status === 'pending')pendingCount += 1
                    else if(f.status === 'Packed')packedCount += 1
                    else if(f.status === 'Shipped')shippedCount += 1
                    else if(f.status === 'Delivered')deliveredCount += 1
                    else if(f.status === 'Cancelled')cancelledCount += 1
                })
            })
        }
        // console.log(placeOrderCount,'pending',pendingCount,'packed',packedCount,'shipped',shippedCount,'dilivered',deliveredCount,'cancelled',cancelledCount);
        
        res.render('admin/home', { admin: true,categoryCount,productCount,userCount,orderCount,dashboard:true,placeOrderCount,pendingCount,packedCount,shippedCount,deliveredCount,cancelledCount})
    }
}
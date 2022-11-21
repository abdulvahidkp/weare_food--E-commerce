const products = require('../../MODEL/productModel')
module.exports={
    getProduct:async(req,res)=>{
        let proId = req.params.id
        let productDetails = await products.findById(proId).lean()
        if(req.session.userId){
            res.render('user/singleProduct',{user:true,data:productDetails,userLogin:true,userShop:true})
        }else{
            res.render('user/singleProduct',{user:true,data:productDetails,userShop:true})
        }
    },
    getContact:(req,res)=>{
        res.render('user/contact',{user:true,userContact:true})
    },
    getWishlist:(req,res)=>{
        res.render('user/wishlist')
    },
    getUserProfile:(req,res)=>{
        res.render('user/myProfile')
    },
    getChangePass:(req,res)=>{
        res.render('user/changePass')
    },
    getOrderDetails:(req,res)=>{
        res.render('user/orderDetails',{user:true,userOrder:true})
    }
}
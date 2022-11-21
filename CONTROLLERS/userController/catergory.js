const categories = require('../../MODEL/categoryModel')
const products = require('../../MODEL/productModel')

module.exports = {
    categoryPage:async(req,res)=>{
        const categoryDetails = await categories.find({}).lean()
        const productDetails = await products.find({}).lean()
        if(req.session.userId){
            res.render('user/shop',{user:true,categoryDetails,productDetails,userLogin:true,userShop:true})
        }else{
            res.render('user/shop',{user:true,categoryDetails,productDetails,userShop:true})
        }
    },
   
}
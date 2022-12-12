const categories = require('../../MODEL/categoryModel')
const products = require('../../MODEL/productModel')
let carts = require('../../MODEL/cartModel')
const wishlists = require('../../MODEL/wishlistModel')

module.exports = {
    categoryPage: async (req, res) => {
        let checkLabel = 'all' 
        let currentPage = parseInt(req.query.page)-1||0
        let query = {};
        let sortBy ={}               
        if(req.query.categoryId){
            query.productCategory=req.query.categoryId
            // checkLabel = req.query.categoryId
        }
        if(req.query.sort){
            if(req.query.sort != 'default'){
                sortBy.productSellingPrice = req.query.sort
            }else{
                sortBy._id = -1
            }
        }else{
            sortBy._id = -1
        }
        query.productStatus = true;
        query.categoryStatus = true;
        if(req.query.category){
            if(req.query.category != 'all'){
                query.productCategory=req.query.category
                checkLabel = req.query.category
            }
        }
        if(req.query.searchProduct){ 
            query.$or=[
                { productName:{$regex:'.*'+req.query.searchProduct+'.*',$options:'i'}}
              ]
        }
        const perPage = 9;
        let totalProducts = await products.find(query).lean().count()
        
        let productDetails = await products.find(query).sort(sortBy).skip((currentPage)*perPage).limit(perPage).lean()
        
        const categoryDetails = await categories.find({ status: true }).lean()
        if (req.session.userId) {
            let userId = req.session.userId
            let wishlistPro = await wishlists.findOne({userId:userId})
            if(wishlistPro){
                wishlistPro = wishlistPro.productId
                productDetails.forEach(e=>{
                    wishlistPro.forEach(f=>{
                        if(e._id.equals(f)){
                            e.wishlist = true
                        }
                    })
                })
            }
            let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
            let countCart = 0;
            if (products) {
                let productsss = products.cartItems
                productsss.forEach(element => {
                    countCart += element.quantity;
                })
            }

            if(req.query.category){
                res.json({ user: true, categoryDetails, productDetails, userShop: true, currentPage, totalProducts, pages: (Math.ceil(totalProducts / perPage)) ,checkLabel})
            }else{
            res.render('user/shop', { user: true, categoryDetails, productDetails, userLogin: true, userShop: true, countCart, currentPage, totalProducts, pages: (Math.ceil(totalProducts / perPage)),checkLabel })
            }
        } else {    
            if(req.query.category){
                res.json({ user: true, categoryDetails, productDetails, userShop: true, currentPage, totalProducts, pages: (Math.ceil(totalProducts / perPage)),checkLabel })
            }else{
                res.render('user/shop', { user: true, categoryDetails, productDetails, userShop: true, currentPage, totalProducts, pages: (Math.ceil(totalProducts / perPage)),checkLabel })
            }
        }

    }
    // searchProducts: async (req, res) => {

    //     const page = parseInt(req.query.page)-1||0
    //     const limit = 6;
    //     const search = req.query.search||""
    //     let sort = req.query.sort || 'Default'
    //     let category = req.query.category || 'All'

    //     const categoryOption =[
    //         'NUTS',
    //         'DRT FRUITS',
    //         'DATES'
    //     ]

    //     category === 'All'?(category=[...categoryOption]):(category = req.query.category.split(','))
    //     req.query.sort?(sort=req.query.sort.split(',')):(sort=[sort])

    //     let sortBy ={}
    //     if(sort[1]){
    //         sortBy[sort[0]]=sort[1]
    //     }else{
    //         sortBy[sort[0]]='asc'
    //     }

    //     const product = await products.find({productName:{$regex:search,$options:"i"},productStatus:true,categoryStatus:true}).populate('productCategory').where('productCategory.category').in([...category]).sort(sortBy).skip(6).limit(6)
    //     console.log(product);

    //     const total = await products.countDocuments({productCategory:{$in:[...category]},name:{$regex:search,$options:'i'}})
    //     console.log(total);

       
    // }
}
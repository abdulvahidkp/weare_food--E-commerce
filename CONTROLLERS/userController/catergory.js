const categories = require('../../MODEL/categoryModel')
const products = require('../../MODEL/productModel')
let carts = require('../../MODEL/cartModel')

module.exports = {
    categoryPage: async (req, res) => {

        let currentPage = parseInt(req.query.page)-1||0
        let search = req.query.searchProduct||''
        
        const perPage = 6;
        let productsss = await products.find({ productStatus: true, categoryStatus: true  ,$or:[
            { productName:{$regex:'.*'+search+'.*',$options:'i'}}
          ]}).lean()
        let totalProducts = productsss.length
        
        let productDetails = await products.find({ productStatus: true, categoryStatus: true,$or:[
            { productName:{$regex:'.*'+search+'.*',$options:'i'}}
          ] }).skip((currentPage)*perPage).limit(perPage).lean()
        const categoryDetails = await categories.find({ status: true }).lean()
        if (req.session.userId) {
            let userId = req.session.userId
            let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
            let countCart = 0;
            if (products) {
                let productsss = products.cartItems
                productDetails.forEach(element => {
                    countCart += element.quantity;
                });
            }
            res.render('user/shop', { user: true, categoryDetails, productDetails, userLogin: true, userShop: true, countCart, currentPage, totalProducts, pages: (Math.ceil(totalProducts / perPage)) })
        } else {
            res.render('user/shop', { user: true, categoryDetails, productDetails, userShop: true, currentPage, totalProducts, pages: (Math.ceil(totalProducts / perPage)) })
        }

    },
    singleCategoryPage: async (req, res) => {
        const catId = req.params.id

        let productDetail = await products.find({ productStatus: true, categoryStatus: true }).lean()

            const categoryDetails = await categories.find({ status: true }).lean()

            let productDetails = productDetail.filter((product) => {
                return product.productStatus
            })

            if (req.session.userId) {
                res.render('user/categoryPage', { user: true, categoryDetails, productDetails, userLogin: true, userShop: true })
            } else {
                res.render('user/categoryPage', { user: true, categoryDetails, productDetails, userShop: true })
            }
        
    },
    searchProducts:async(req,res)=>{

        let search = req.query.searchProducts||''       
        const searchProduct = await products.find({
            productStatus:true,
            categoryStatus:true,
            $or:[
              { productName:{$regex:'.*'+search+'.*',$options:'i'}}
            ]
        })
        console.log(searchProducts);
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
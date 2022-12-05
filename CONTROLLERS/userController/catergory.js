const categories = require('../../MODEL/categoryModel')
const products = require('../../MODEL/productModel')
let carts = require('../../MODEL/cartModel')

module.exports = {
    categoryPage: async (req, res) => {
        let pageNum = req.query.page
        const perPage = 3
        let totalProducts;
        await products.find({productStatus:true }).countDocuments().then(documents=>{
            totalProducts = documents
            return products.find().skip((pageNum-1)*perPage).limit(perPage)
        }).then(productsss =>{
        })
        
        await products.find({productStatus:true}).populate({ path: 'productCategory', match: { status: true } }).then((resp)=>{
            console.log(resp);
            // console.log(resp);
        })

        await products.find({productStatus:true}).populate({ path: 'productCategory', match: { status: true } }).lean().exec(async (err, products) => {
            let productDetails = products.filter((products) => {
                return products.productCategory
            })
            // console.log(productDetails)
            
            totalDocuments = productDetails.length
            console.log(totalDocuments);

            const categoryDetails = await categories.find({ status: true }).lean()
            if (req.session.userId) {
                let userId = req.session.userId
                let products = await carts.findOne({ userId: userId }).populate('cartItems.productId').lean()
                let countCart = 0;
                if (products) {
                    let productDetails = products.cartItems
                    productDetails.forEach(element => {
                        countCart += element.quantity;
                    });
                }
                res.render('user/shop', { user: true, categoryDetails, productDetails, userLogin: true, userShop: true, countCart })
            } else {
                res.render('user/shop', { user: true, categoryDetails, productDetails, userShop: true })
            }

        })
    },
    singleCategoryPage: async (req, res) => {
        const catId = req.params.id

        await products.find({ productCategory: catId }).populate({ path: 'productCategory', match: { status: true } }).lean().exec(async (err, products) => {
            let productDetail = products.filter((products) => {
                return products.productCategory
            })

            const categoryDetails = await categories.find({ status: true }).lean()

            let productDetails = productDetail.filter((product) => {
                return product.productStatus
            })

            if (req.session.userId) {
                res.render('user/categoryPage', { user: true, categoryDetails, productDetails, userLogin: true, userShop: true })
            } else {
                res.render('user/categoryPage', { user: true, categoryDetails, productDetails, userShop: true })
            }
        })
    }
}
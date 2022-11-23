const categories = require('../../MODEL/categoryModel')
const products = require('../../MODEL/productModel')

module.exports = {
    categoryPage: async (req, res) => {
        +
            await products.find({}).populate({ path: 'productCategory', match: { status: true } }).lean().exec(async (err, products) => {
                let productDetails = products.filter((products) => {
                    return products.productCategory
                })
                const categoryDetails = await categories.find({ status: true }).lean()

                if (req.session.userId) {
                    res.render('user/shop', { user: true, categoryDetails, productDetails, userLogin: true, userShop: true })
                } else {
                    res.render('user/shop', { user: true, categoryDetails, productDetails, userShop: true })
                }

            })
    }
}
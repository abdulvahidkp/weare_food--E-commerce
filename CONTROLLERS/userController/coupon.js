const coupons = require('../../MODEL/couponModel')

module.exports = {
    applyCoupon: async (req, res) => {
        console.log('hello');
        let code = req.body.code;
        code = code.toUpperCase()
        await coupons.findOne({ code ,status:true}).then((result) => {
            res.json(result)
        })
    }
}
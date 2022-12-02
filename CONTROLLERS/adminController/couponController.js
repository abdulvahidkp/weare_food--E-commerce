const coupons = require('../../MODEL/couponModel') 

module.exports = {
    couponGet:async(req,res)=>{
        const couponDetails = await coupons.find({}).lean()
        console.log(couponDetails);
        res.render('admin/coupons',{admin:true,coupon:true,data:couponDetails})
    },
    couponPost:async(req,res)=>{
        try {
            let {code,percentage} = req.body
            await coupons.create({code,percentage})
            console.log('created new coupon succesfully');
            res.redirect('/admin/coupons')
        } catch (error) {
            console.log(error.message);
        }
    },
    couponAction:async(req,res)=>{
        couponId = req.query.id
        await coupons.updateOne({_id:couponId},[ { "$set": { "status": { "$eq": [false, "$status"] } } } ])
        res.redirect('/admin/coupons')
    }
}
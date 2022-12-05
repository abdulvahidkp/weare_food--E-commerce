const orders = require('../../MODEL/orderModel')

module.exports = {
    orderManagementGet: async (req, res) => {
        await orders.find({})

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
        res.render('admin/orderManagement', { admin: true, order: true ,hell})
    },                  
    singleOrderDetails:async(req,res)=>{                                                                                                                                 
        let data = await orders.findOne({'orderDetails._id':req.params.id},{orderDetails:{$elemMatch:{_id:req.params.id}}}).populate('orderDetails.orderItems.productId').lean()
        data = data.orderDetails[0];
        res.render('admin/orderProducts',{admin:true,order:true,data})
    },
    changeOrderStatus:async(req,res)=>{
        let status = req.body.orderStatus
        let orderId = req.body.orderId
        try {
            await orders.updateOne({orderDetails:{$elemMatch:{_id:orderId}}},{'orderDetails.$.status':status})
            res.json({updated:true})
        } catch (error) {
            console.log(error.message);
        }
    }
} 
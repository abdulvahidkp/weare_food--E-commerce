const users = require('../../MODEL/userModel')

module.exports = {
    userGet: async (req, res) => {
        let userDetails = await users.find({}).lean()
        console.log(userDetails);
        res.render('admin/userDetails', { admin: true, userDetails, userDetail: true })
    },
    userAction:async(req,res)=>{
        let userId = req.query.id
        let userDetails = await users.findById(userId)
        console.log(userDetails);
        if (userDetails.blockStatus === true) {
            userDetails.blockStatus = false
            await userDetails.save()
        } else {
            userDetails.blockStatus = true
            await userDetails.save()
        }
        res.redirect('/admin/userDetails')
    }
}
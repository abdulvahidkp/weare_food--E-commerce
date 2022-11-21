const users = require('../../MODEL/userModel')

module.exports = {
    userGet: async (req, res) => {
        

        let userDetails = await users.find({}).lean()
        console.log(userDetails);
        
        res.render('admin/userDetails', { admin: true, userDetails, userDetail: true })

    }
}
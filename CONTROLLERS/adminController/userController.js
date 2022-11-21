const users = require('../../MODEL/userModel')

module.exports = {
    userGet: async (req, res) => {
        //pagination setting
        const pageNum = req.query.page;
        const perPage = 3
        let docCount;

        let userDetails = await users.find().countDocuments().then((documents)=>{ 
            docCount = documents;
            totalPages = Math.ceil(docCount/perPage)
            return users.find().skip((pageNum - 1) * perPage).limit(perPage).lean()
        })
        res.render('admin/userDetails', { admin: true, data: userDetails, userDetails: true ,pageNum,totalDoc : docCount, totalPages})
    }
}
const users = require('../MODEL/userModel')

module.exports = {
    verifyLoginUser:async (req, res, next) => {
        if (req.session.userId) {
            let userId = req.session.userId
            await users.findOne({_id:userId}).then((user)=>{
                if(user.blockStatus === false){
                    return next()
                }else{
                    req.session.userId = null
                    return next()
                }
            })
        } else {
            let err = new Error('user not authenticated');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            res.redirect('/login')
        }
    }
}


module.exports = {
    verifyLoginUser: (req, res, next) => {
        if (req.session.userId) {
            return next()
        } else {
            let err = new Error('user not authenticated');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            res.redirect('/login')
        }
    }
}


module.exports = {
    verifyLogin: (req, res, next)=>{
        if (!req.session.admin) {
            let err = new Error('you are not authenticated');
            res.setHeader('WWW-Authenticate','Basic');
            err.status = 401;
            res.redirect('/admin') 
        } else {
            return next()
        }
    }
}

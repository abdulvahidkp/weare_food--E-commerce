const admins = require('../../MODEL/adminModel')
const bcrypt = require('bcrypt')
const categories = require('../../MODEL/categoryModel')
const products = require('../../MODEL/productModel')
const users = require('../../MODEL/userModel')
const catergory = require('../userController/catergory')
let message = ''

module.exports = {
    loginGet: (req, res) => {
        if (req.session.admin) {
            res.redirect('/admin/home')
        }else{
            res.render('admin/login', { message })
            message = ''
        }
       
    },
    loginPost: async (req, res) => {
        let userDetails =  req.body
            const admin = await admins.findOne({ email: userDetails.email })
            if (admin) {
                let status = await bcrypt.compare(userDetails.password, admin.password)
                if (status) {  
                    req.session.admin = userDetails.email
                    console.log('login success');
                    res.redirect('/admin/home')
                }
                else {
                    console.log('password incorrect');
                    message = 'invalid username or password'
                    res.redirect('/admin')
                }
            } else {
                console.log('invalid username');
                message = 'invalid username or password'
                res.redirect('/admin')
            }
       
    },
    logout:async(req,res)=>{
        req.session.admin = null
        res.redirect('/admin');
    },
    homeGet: async (req, res) => {
        const categoryCount = await categories.find().count()
        const productCount = await products.find().count()
        const userCount = await users.find().count()
        
        res.render('admin/home', { admin: true,categoryCount,productCount,userCount,dashboard:true})
    }
}
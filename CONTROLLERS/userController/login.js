const users = require('../../MODEL/userModel')
const bcrypt = require('bcrypt')
const categorySchema = require('../../MODEL/categoryModel')
const bannerSchema = require('../../MODEL/bannerModel')
const wishlist = require('../../MODEL/wishlistModel')
const products = require('../../MODEL/productModel')
const carts = require('../../MODEL/cartModel')
let otpMsg = ''
let logMsg = ''
let signupUser;
let signupEmail;
let signupPassword;
let OTP;
const nodemailer = require('nodemailer')
// run()
// async function run() {
//     try {
//         const user1 = await users.create({ name: 'weare', age: 'hey', hobbies: ['hy', 'where'], address: { street: 'helo' } })
//         console.log(user1)
//     } catch (error) {
//         console.log(error.message);
//     }
// }


/* for otp  */
let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "abdulvahid1117@gmail.com",
        pass: "vnywjqofxvivbuqv",
    },
});
 



module.exports = {
    homePage: async (req, res) => {
        let productDetails = await products.find({productStatus:true,categoryStatus:true}).sort({_id:-1}).limit(8).lean()
            const category = await categorySchema.find({ status: true }).lean()
            const banner = await bannerSchema.findOne().lean()

            if (req.session.userId) {
                let userId = req.session.userId
                // let wishlistDetails = await wishlist.findOne({userId:userId}).populate('productId')
                // let productsInCart = wishlistDetails.productId
                // let countCart = productsInCart.length
                let cartProducts = await carts.findOne({userId:userId}).populate('cartItems.productId').lean()
                let countCart = 0;
                if(cartProducts){
                        let productDetail = cartProducts.cartItems
                        productDetail.forEach(element => {
                          countCart += element.quantity;
                        });
                    }  
                res.render('user/userHome', { user: true, userLogin: true, userHome: true, category, banner,data:productDetails, countCart})
            } else {
                res.render('user/userHome', { user: true, userHome: true, category, banner ,data:productDetails})
            }
        
        
        // const category = await categorySchema.find({ status: true }).lean()
        // const banner = await bannerSchema.findOne().lean()
    },
    loginPage: (req, res) => {
        if (req.session.userId) {
            res.redirect('/')
        } else {
            res.render('user/login', { user: true, logMsg })
            logMsg = ''
        }
    },
    postLoginPage: async (req, res) => {
        let userDetails = req.body
        try {
            const user = await users.findOne({ email: userDetails.email })
            if (user) {
                let status = await bcrypt.compare(userDetails.password, user.password)
                if (status) {
                        if (user.blockStatus === false) {
                            req.session.userId = user._id
                            req.session.email = user.email
                            console.log('login success');
                            res.redirect('/')
                        } else {
                            logMsg = "your account has been blocked"
                            res.redirect('/login')
                        }
                }
                else {
                    console.log('password incorrect');
                    logMsg = 'invalid username or password'
                    res.redirect('/login')
                }
            } else {
                logMsg = 'invalid username or password'
                res.redirect('/login')
            }
        } catch (error) {
            console.log(error.message)
        }
    },
    getSignupPage: (req, res) => {
        res.render('user/signup', { user: true, msg })
        msg = ''
    },
    postSignupPage: async (req, res) => {

        signupName = req.body.name
        signupEmail = req.body.email
        signupPassword = await bcrypt.hash(req.body.password, 10)
        OTP = `${Math.floor(1000 + Math.random() * 9000)}`;
        let mailDetails = {
            from: "abdulvahid1117@gmail.com",
            to: signupEmail,
            subject: "WEARE_FOODS ACCOUNT REGISTRATION",
            html: `<p>YOUR OTP FOR REGISTERING IN WEARE FOODS IS ${OTP}</p>`,
        };
        
        const user = await users.findOne({email:signupEmail})
        if(user){
            msg = 'email already exist'
            res.redirect('/signup')
        }else{
            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log("Error Occurs");
                } else {
                    console.log("Email sent successfully");
                    res.redirect('/otpVerify')
                }
            });
        }
    },

    otpGet: (req, res) => {
        res.render('user/otp', { user: true, otpMsg })
        otpMsg = ''
    },
    otpPost: async (req, res) => {
        let { otp } = req.body
        if (OTP === otp) {
            const user = await users.create({name:signupName,email:signupEmail,password:signupPassword})
            res.redirect('/login')
        } else {
            otpMsg = 'entered OTP is invalid'
            res.redirect('/otpVerify')
        }
    },
    logout: async (req, res) => {
        req.session.userId = null
        res.redirect('/');
    }
}
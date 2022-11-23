const router = require('express').Router()
const loginControllers = require('../CONTROLLERS/userController/login')
const cartControllers = require('../CONTROLLERS/userController/cart')
const categoryControllers = require('../CONTROLLERS/userController/catergory')
const checkoutControllers = require('../CONTROLLERS/userController/checkout')
const wishlistControllers = require('../CONTROLLERS/userController/wishlist')
const auth = require('../MIDDLEWARE/authenticationUser').verifyLoginUser


const userController =require('../CONTROLLERS/userController/controller')

router.get('/',loginControllers.homePage)
router.get('/login',loginControllers.loginPage)
router.post('/login',loginControllers.postLoginPage)
router.get('/signup',loginControllers.getSignupPage)
router.post('/signup',loginControllers.postSignupPage)
router.get('/otpVerify',loginControllers.otpGet)
router.post('/otpVerify',loginControllers.otpPost)
router.get('/shop',categoryControllers.categoryPage)
router.get('/product/:id',userController.getProduct)
router.get('/logout',loginControllers.logout)
router.get('/cart',cartControllers.cartPage)
router.get('/checkout',checkoutControllers.checkoutPage)
router.get('/contact',userController.getContact)
router.get('/wishlist',wishlistControllers.getWishlist)
router.post('/addWishlist',wishlistControllers.addWishlist)
router.get('/userProfile',userController.getUserProfile)
router.get('/changePass',userController.getChangePass)
router.get('/orderDetails',userController.getOrderDetails)


module.exports = router;
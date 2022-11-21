const router = require('express').Router()
const adminController = require('../CONTROLLERS/adminController/loginController')
const categoryController = require('../CONTROLLERS/adminController/categoryController')
const productController = require('../CONTROLLERS/adminController/productController')
const userController = require('../CONTROLLERS/adminController/userController')
const bannerController = require('../CONTROLLERS/adminController/bannerController')
const uploadToFile = require('../MIDDLEWARE/multer')
const auth = require('../MIDDLEWARE/authentication').verifyLogin


 
router.get('/',adminController.loginGet)
router.post('/',adminController.loginPost)
// router.use(auth)
router.get('/home',adminController.homeGet)
router.get('/categories',categoryController.categoriesGet)
router.post('/categories',uploadToFile.single('picture',12),categoryController.categoriesPost)
router.get('/categoryAction',categoryController.categoryAction)
router.get('/products',productController.productGet) 
router.get('/addProduct',productController.addProductGet)
router.post('/addProduct',uploadToFile.array('picture',12),productController.addProductPost)
router.get('/productDelete',productController.productDelete)
router.get('/userDetails',userController.userGet)
router.get('/banner',bannerController.bannerGet)
router.get('/logout',adminController.logout)


module.exports = router
 
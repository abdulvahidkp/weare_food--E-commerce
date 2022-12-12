const categories = require('../../MODEL/categoryModel')
const products = require('../../MODEL/productModel')
const uploadToCloudinary = require('../../MIDDLEWARE/cloundinary')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

module.exports = {
    categoriesGet: async (req, res) => {
        let allCategory = await categories.find({}).lean()
        res.render('admin/categories', { admin: true, data: allCategory, category: true })
    },
    categoriesPost: async (req, res) => {

        // let compressedImageFileSavePath = path.join(__dirname, '../../uploads', new Date().getTime() + req.file.originalname)
        const filePath = req.file.path
        const result = await uploadToCloudinary(filePath)

        // let comImg = sharp(filePath)
        //     .resize(900,700)
        //     .jpeg({ quality: 80, chromaSubsampling: '4:4:4' })
        //     .toFile(compressedImageFileSavePath, async (err, info) => {
        //         await fs.unlinkSync(filePath)
        //     })

        // localFilePath = comImg.options.fileOut;
        

        // let parent = path.basename(path.dirname(localFilePath))
        // const lastItem = localFilePath.substring(localFilePath.lastIndexOf('/') + 1)
        // newPath = '/' + parent + '/' + lastItem
        newPath = result.url
        let newCategory = req.body.categoryName
        try {
            await categories.create({ category: newCategory ,imagePath:newPath})
            res.redirect('/admin/categories')
        } catch (error) {
            console.log(error.message)
            res.redirect('/admin/categories')
        }
    },
    categoryAction: async (req, res) => {
        categoryId = req.query.id
        let categoryDetail = await categories.findOne({ _id: categoryId })

        if (categoryDetail.status === true) {
            categoryDetail.status = false
            await categoryDetail.save()
        } else {    
            categoryDetail.status = true
            await categoryDetail.save()
        }

        await products.updateMany({productCategory:categoryId},[ { "$set": { "categoryStatus": { "$eq": [false, "$categoryStatus"] } } } ]).then((resp)=>{
            res.redirect('/admin/categories')
        })
    }
} 


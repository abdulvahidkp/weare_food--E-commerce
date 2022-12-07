const categories = require('../../MODEL/categoryModel')
const products = require('../../MODEL/productModel')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

module.exports = {
    categoriesGet: async (req, res) => {
        let allCategory = await categories.find({}).lean()
        res.render('admin/categories', { admin: true, data: allCategory, category: true })
    },
    categoriesPost: async (req, res) => {

        let compressedImageFileSavePath = path.join(__dirname, '../../uploads', new Date().getTime() + req.file.originalname)
        const filePath = req.file.path

        let comImg = sharp(filePath)
            .resize(900,700)
            .jpeg({ quality: 80, chromaSubsampling: '4:4:4' })
            .toFile(compressedImageFileSavePath, async (err, info) => {
                await fs.unlinkSync(filePath)
            })

        localFilePath = comImg.options.fileOut;

        let parent = path.basename(path.dirname(localFilePath))
        const lastItem = localFilePath.substring(localFilePath.lastIndexOf('/') + 1)
        newPath = '/' + parent + '/' + lastItem

        let newCategory = req.body.categoryName
        try {
            await categories.create({ category: newCategory ,imagePath:newPath})
            console.log('category added');
            res.redirect('/admin/categories')
        } catch (error) {
            console.log(error.message)
            res.redirect('/admin/categories')
        }
    },
    categoryAction: async (req, res) => {
        categoryId = req.query.id
        console.log(categoryId);
        let categoryDetail = await categories.findOne({ _id: categoryId })

        

        if (categoryDetail.status === true) {
            console.log("it's here")
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


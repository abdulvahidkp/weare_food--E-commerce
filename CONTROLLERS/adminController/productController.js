const categories = require('../../MODEL/categoryModel')
const products = require('../../MODEL/productModel')
const uploadToCloudinary = require('../../MIDDLEWARE/cloundinary')
const mongoose = require('mongoose')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

module.exports = {

    productGet: async (req, res) => {
        let productDetails = await products.find({}).populate({ path: 'productCategory' }).lean()
        res.render('admin/products', { admin: true, data: productDetails, product: true })

        // console.log(productDetails);
    },
    addProductGet: async (req, res) => {
        const categoryDetails = await categories.find({ status: { $ne: false } }).lean()
        res.render('admin/addProduct', { admin: true, data: categoryDetails, product: true })
        msg = ''
    },
    addProductPost: async (req, res) => {

        // let imageUrlList = [];
        // for (var i = 0; i < req.files.length; i++) {
        //     var locaFilePath = req.files[i].path;
        //     // Upload the local image to Cloudinary and get image url as response
        //     var result = await uploadToCloudinary(locaFilePath);
        //     imageUrlList.push(result.url);
        // }
        let localFilePath = []
        for (let i = 0; i < req.files.length; i++) {
            let compressedImageFileSavePath = path.join(__dirname, '../../uploads', new Date().getTime() + req.files[i].originalname)

            const filePath = req.files[i].path

            let comImg = sharp(filePath)
                .resize(900)
                .jpeg({ quality: 80, chromaSubsampling: '4:4:4' })
                .toFile(compressedImageFileSavePath, async (err, info) => {
                    await fs.unlinkSync(filePath)
                })
            localFilePath[i] = comImg.options.fileOut;
        };

        let { name, productCategory, stock, mrp, sellingPrice, description } = req.body;
        const capitalize = s => s && s[0].toUpperCase() + s.slice(1)
        let editedName = capitalize(name)


        try {

            let proCat = mongoose.Types.ObjectId(productCategory).toString()

            let newProduct = await new products({
                productName: editedName,
                productCategory: proCat,
                productStock: stock,
                productPrice: mrp,
                productSellingPrice: sellingPrice,
                productDescription: description
            })

            for (let x = 0; x < req.files.length; x++) {
                let parent = path.basename(path.dirname(localFilePath[x]))
                const lastItem = localFilePath[x].substring(localFilePath[x].lastIndexOf('/') + 1)
                newPath = '/' + parent + '/' + lastItem

                newProduct.image[x] = newPath
            }

            // for (let x = 0; x < imageUrlList.length; x++) {
            //     newProduct.image[x] = { urlName: imageUrlList[x], fileName: req.files[x].filename }
            // }

            await newProduct.save()
            res.redirect('/admin/addProduct')
        } catch (err) {
            console.log(err.message);
            res.status(500).json({
                message: "Creating a product failed!",
            });
        }
    },
    productEditGet: async (req, res) => {
        let proId = req.params.id
        const categoryDetails = await categories.find({ status: { $ne: false } }).lean()
        let productDetails = await products.findOne({ _id: proId }).populate({ path: 'productCategory' }).lean()
        res.render('admin/editProducts', { admin: true, data: productDetails, product: true, categoryDetails })
    },
    productEditPost: async (req, res) => {

        let proId = req.params.id
        let newProduct = await products.findOne({ _id: proId })

        let localFilePath = []
        if (req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                let compressedImageFileSavePath = path.join(__dirname, '../../uploads', new Date().getTime() + req.files[i].originalname)
                const filePath = req.files[i].path
                let comImg = sharp(filePath)
                    .resize(900)
                    .jpeg({ quality: 80, chromaSubsampling: '4:4:4' })
                    .toFile(compressedImageFileSavePath, async (err, info) => {
                        await fs.unlinkSync(filePath)
                    })
                localFilePath[i] = comImg.options.fileOut;
            };
        }
        if (req.files.length > 0) {
            for (let x = 0; x < req.files.length; x++) {
                let parent = path.basename(path.dirname(localFilePath[x]))
                const lastItem = localFilePath[x].substring(localFilePath[x].lastIndexOf('/') + 1)
                newPath = '/' + parent + '/' + lastItem

                newProduct.image[x] = newPath
            }
            await newProduct.save()
        }

        let { name, productCategory, stock, mrp, sellingPrice, description } = req.body;
        const capitalize = s => s && s[0].toUpperCase() + s.slice(1)
        let editedName = capitalize(name)
        let proCat = mongoose.Types.ObjectId(productCategory).toString()

        await products.updateOne({ _id: proId },
            {
                $set: {

                    productName: editedName,
                    productCategory: proCat,
                    productStock: stock,
                    productPrice: mrp,
                    productSellingPrice: sellingPrice,
                    productDescription: description
                }
            })

        res.redirect('/admin/products')
    },
    productDelete: async (req, res) => {
        productId = req.query.id
        await products.findByIdAndDelete(productId)
        res.redirect('/admin/products')
    }
}

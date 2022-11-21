const categories = require('../../MODEL/categoryModel')
const products = require('../../MODEL/productModel')
const uploadToCloudinary = require('../../MIDDLEWARE/cloundinary')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

module.exports = {
    productGet: async (req, res) => {
        const productDetails = await products.find({}).lean()
        res.render('admin/products', { admin: true, data: productDetails,product:true })
    },
    addProductGet: async (req, res) => {
        const categoryDetails = await categories.find({}).lean()
        res.render('admin/addProduct', { admin: true, data: categoryDetails,product:true })
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
                console.log(localFilePath);
        };

        let { name, category, stock, mrp, sellingPrice, description } = req.body;
        const capitalize = s => s && s[0].toUpperCase() + s.slice(1)
        let editedName = capitalize(name)

        try {
            let newProduct = await new products({
                productName: editedName,
                productCategory: category,
                productStock: stock,
                productPrice: mrp,
                productSellingPrice: sellingPrice,
                productDescription: description
            })

            for (let x = 0; x < req.files.length; x++) {
                let parent =path.basename(path.dirname(localFilePath[x]))
                const lastItem = localFilePath[x].substring(localFilePath[x].lastIndexOf('/') + 1)
                newPath = '/'+parent+'/'+lastItem

                console.log(newPath);
                newProduct.image[x] =  newPath
                console.log(newProduct.image);
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
    productDelete: async (req, res) => {
        productId = req.query.id
        let product = await products.findByIdAndDelete(productId)
        res.redirect('/admin/products')
    }
}

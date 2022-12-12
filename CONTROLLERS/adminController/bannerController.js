const banners = require('../../MODEL/bannerModel')
const uploadToCloudinary = require('../../MIDDLEWARE/cloundinary')

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

module.exports = {
    bannerGet:async (req, res) => {
        const bannerDetails = await banners.findOne({}).lean()
        res.render('admin/banner', { admin: true, banner: true ,bannerDetails})
    },
    addBannerGet: (req, res) => {
        res.render('admin/addBanner', { admin: true, banner: true })
    },
    addBannerPost: async (req, res) => {

        // let compressedImageFileSavePath = path.join(__dirname, '../../uploads', new Date().getTime() + req.file.originalname)
        const filePath = req.file.path

        // let comImg = sharp(filePath)
        //     .resize(900)
        //     .jpeg({ quality: 80, chromaSubsampling: '4:4:4' })
        //     .toFile(compressedImageFileSavePath, async (err, info) => {
        //         await fs.unlinkSync(filePath)
        //     })
        const result = await uploadToCloudinary(filePath)

        // localFilePath = comImg.options.fileOut;
        // let parent = path.basename(path.dirname(localFilePath))
        // const lastItem = localFilePath.substring(localFilePath.lastIndexOf('/') + 1)
        // newPath = '/' + parent + '/' + lastItem

        let mainHead = req.body.main
        let newMainHead = mainHead.toUpperCase()

        const reqSub = req.body.sub
        const newSub = reqSub.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

        const reqPara = req.body.para
        const newPara = reqPara.toLowerCase()
        try {
            await banners.findOneAndDelete({})
            await banners.create({ mainHead: newMainHead, subHead:newSub,paragraph:newPara, imagePath: result.url })
            res.redirect('/admin/banner')
        } catch (error) {
            console.log(error.message)
            res.redirect('/admin/banner')
        }
    }
}
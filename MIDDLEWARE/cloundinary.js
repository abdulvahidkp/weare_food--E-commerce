const cloudinary = require("cloudinary").v2;
const fs = require('fs')
require('dotenv/config')

//cloudinary configaration
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET
});

// locaFilePath: path of image which was just uploaded to "uploads" folder , its sending when calling this function
const uploadToCloudinary = async (localFilePath) => {
    // filePathOnCloudinary: path of image we want to set when it is uploaded to cloudinary
    const filePathOnCloudinary = "main" + "/" + localFilePath;
    cloudinary.image(localFilePath,{quality:'auto',fetch_format:'auto'})
    return cloudinary.uploader.upload(localFilePath,{ public_id: filePathOnCloudinary }).then((result) => {
        fs.unlinkSync(localFilePath);
        return {
            message: "Success", url: result.url,
        };
    }).catch((error) => {
        fs.unlinkSync(localFilePath);
        return { message: "Fail" };
    });
}

module.exports = uploadToCloudinary 
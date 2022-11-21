const cloudinary = require("cloudinary").v2;
const fs = require('fs')

//cloudinary configaration
cloudinary.config({
    cloud_name: 'desr7slhc',
    api_key: '235693447949737',
    api_secret: 'f8pHE6X6tYLJkwURY8LnqT3yWmw'
});

// locaFilePath: path of image which was just uploaded to "uploads" folder , its sending when calling this function
const uploadToCloudinary = async (localFilePath) => {
    // filePathOnCloudinary: path of image we want to set when it is uploaded to cloudinary
    const filePathOnCloudinary = "main" + "/" + localFilePath;
    console.log('near');
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
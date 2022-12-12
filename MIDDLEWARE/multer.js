const multer = require("multer")
//we need to setup something in app.js

//multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
  
// const maxSize = 1 * 1000 * 1000;
const uploadToFile = multer({
    storage: storage
})

module.exports = uploadToFile
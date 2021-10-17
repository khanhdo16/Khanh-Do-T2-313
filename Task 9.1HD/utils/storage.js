const path = require('path')
const multer = require("multer") //File storage management
const { nanoid } = require('nanoid') //Unique IDs generator


/* FILE STORAGE CONFIGURATION */
//Configure file destination & file name generator
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname))
    }
})

//Configure restrictions for file upload
const uploadConfig = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 * 10,
    },
    fileFilter: (req, file, cb) => {
        const mimetype = [
            'image/png', 'image/jpg', 'image/jpeg',
            'image/webp', 'image/gif'
        ]

        if(mimetype.some(type => type === file.mimetype)) {
            cb(null, true)
        }
        else {
            cb(null, false)
            return cb(new Error("INVALID_TYPE"))
        }
    },
})

module.exports = uploadConfig
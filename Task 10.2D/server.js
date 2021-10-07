const express = require("express")
const multer = require("multer")
const { nanoid } = require('nanoid')
const path = require('path')
const cors = require('cors')
const configs = require("./configs.js")
const app = express()

const Task = require("./models/Task.js")

var port = process.env.PORT || 5000

configs.database()

app.use(cors())
//Parse request as JSON
app.use(express.json())
//Set static assets folder
app.use(express.static(__dirname + "/public", {
    index: false,
}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


//Task route: Post a new task
app.route('/task')
    .get((req, res) => {
        const { search, suburb, date } = req.query

        const query = {}
        if(search) {
            query['title'] = { "$regex": search.toLowerCase(), "$options": "i" }
        }
        if(suburb) {
            query['suburb'] = { "$regex": suburb.toLowerCase(), "$options": "i" }
        }
        if(date) {
            let [start, end] = date.split(',')

            start = start.split('/')
            start = new Date(start[2], start[1] - 1, start[0])

            end = end.split('/')
            end = new Date(end[2], end[1] - 1, end[0])

            query['date'] = { $gte: start, $lte: end }
        }

        Task.find(query, (err, tasks) => {
            if(err) {
                res.status(400).json({message: "Failed to retrieve tasks."})
            }
            else if(tasks) {
                res.status(200).json(tasks)
            }
        })
    })
    .post((req, res) => {
        Task.create(req.body , (err, task) => {
            if(err) {
                let data = {}
                let errors = err.errors

                for(const [key, value] of Object.entries(errors)) {
                    data[key] = value.message
                }
                
                res.status(400).json(data)
            }
            else if(task) {
                res.status(200).json(task)
            }
        })
    })
    .delete((req, res) => {
        const { _id } = req.body
        
        if(_id) {
            Task.findByIdAndDelete(_id, (err) => {
                if(err) {
                    res.status(400).json({message: 'Can\'t delete task, please try again later!'})
                }
                else {
                    res.sendStatus(200)
                }
            })
        }
    })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname))
    }
})

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

const singleUpload = uploadConfig.single('image')


app.post('/upload', (req, res) => {
    singleUpload(req, res, (err) => {
        if(req.file.originalname === 'Banner.jpg' || req.file.originalname === 'Banner') {
            return res.status(400).json({message: 'This file is not allowed.'})
        }
        if(err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({message: 'File should not exceed 10MB.'})
            }
            else {
                switch (err.message) {
                    case "FILE_MISSING":
                        res.status(400).json({message: 'Please select a file before uploading.'})
                        break
                    case "INVALID_TYPE":
                        res.status(400).json({message: 'Only image files allowed.'})
                        break
                    default:
                        res.status(400).json({message: 'Something went wrong. Please try again later.'})
                        break
                }
            }
        }
        else {
            res.status(200).json({path: req.file.path})
        }
    })
})


//Start app on port
app.listen(port, function (req, res){
    console.log("Server is running on port " + port.toString())
})
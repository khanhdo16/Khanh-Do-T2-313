const Task = require("../../models/Task.js")

//Configure file upload
const singleUpload = require('../storage.js').single('image')

const tasks = {
    retrieve: function(req, res) {
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
    },
    retrieveByUser: function(req, res) {
        Task.find({user: req.params.id}, (err, tasks) => {
            if(err) {
                res.status(400).json({message: "Failed to retrieve tasks."})
            }
            else if(tasks) {
                res.status(200).json(tasks)
            }
        })
    },
    create: function(req, res) {
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
    },
    delete: function(req, res) {
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
    },
    upload: function(req, res) {
        singleUpload(req, res, (err) => {
            if(err) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({message: 'File should not exceed 10MB.'})
                }
                else {
                    console.log(err.message)
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
    },
    //Update single task by id
    updateById: function(id, updateData, response) {
        Task.findByIdAndUpdate(
            id,
            updateData,
            {
                runValidators: true,
                context: 'query'
            },
            (err) => {
                if(err) {
                    let data = {}
                    let errors = err.errors
        
                    for(const [key, value] of Object.entries(errors)) {
                        data[key] = value.message
                    }
                    
                    response.status(400)
                    response.json(data)
                }
                else {
                    response.status(200)
                    response.json({message: "Task updated successfully!"})
                }
        })
    },
}

module.exports = tasks
const express = require("express")
const configs = require("./configs.js")
const app = express()

const Task = require("./models/Task.js")

var port = process.env.PORT || 5000

configs.database()

//Parse request as JSON
app.use(express.json())
//Set static assets folder
app.use(express.static(__dirname + "/public", {
    index: false,
}))


//Home route: Sign in page
app.post('/task', (req,res) => {
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


//Start app on port
app.listen(port, function (req, res){
    console.log("Server is running on port " + port.toString())
})
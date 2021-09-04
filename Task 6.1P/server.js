const express = require("express")
const mongoose = require("mongoose")

const actions = require("./actions.js")
const app = express()

var port = process.env.PORT || 5000

//Establish connection to MongoDB
mongoose.connect(
    'mongodb+srv://xkdo:LbXB85XJw3iAYb3z@cluster0.5vkos.mongodb.net/myFirstDatabase?retryWrites=true',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', function() {
  console.log('Established connection to database!')
})


//Parse request as JSON
app.use(express.json())

//Set static assets folder
app.use(express.static(__dirname + "/public", {
    index: false,
}))


//Home route: Sign in page
app.route('/')
    .get((req,res)=>{
        res.sendFile(__dirname + "/custsignin.html")
    })
    .post((req, res) => {
        actions.authenticateUser(req.body, res)
    })

//Sign up route
app.route('/custsignup.html')
    .get((req,res)=>{
        res.sendFile(__dirname + "/custsignup.html")
    })
    .post((req, res) => {
        actions.registerUser(req.body, res)
    })

//Customer task route
app.get('/custtask.html', (req,res) => {
    res.sendFile(__dirname + "/custtask.html")
})


//Experts REST API
//Retrieve, create, delete expert(s)
app.route('/experts')
    .get((req, res) => {
        actions.retrieveExperts(res)
    })
    .post((req, res) => {
        actions.registerExpert(req.body, res)
    })
    .delete((req, res) => {
        actions.deleteExperts(res)
    })

//Retrieve, update, delete specific expert
app.route('/experts/:id')
    .get((req, res) => {
        actions.getExpertById(req.params.id, res)
    })
    .patch((req, res) => {
        actions.updateExpertById(req.params.id, req.body, res)
    })
    .delete((req, res) => {
        actions.deleteExpertById(req.params.id, res)
    })


//Start app on port
app.listen(port, function (req, res){
    console.log("Server is running on port " + port.toString())
})
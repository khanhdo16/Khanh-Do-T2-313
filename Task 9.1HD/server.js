//Nodejs Express core
const express = require("express")
const configs = require("./utils/configs.js")
const app = express()

const cors = require('cors') //Cross-site access
const passport = require("passport") //Handle authentication
const session = require('express-session') //Store credentials in cookies

//Plug-ins
const date = require('datejs')
const path = require('path')


//Configure port for server
var port = process.env.PORT || 5000



/* STATIC CONTENT */
// //Set static assets folder
// app.use(express.static(__dirname + "/public", {
//     index: false,
// }))
//Configure access for uploads
app.use('/public/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.static(path.join(__dirname, 'client', 'build')))



/* CONFIGURE EXPRESS SERVER */
//Allow cross-site request
app.use(cors({
    credentials: true,
    origin: true
}))
app.use(express.json()) //Parse request as JSON



/* CONFIGURE DATABASE */
configs.database() //Initialize MongoDB database



/* CONFIGURE SESSIONS & COOKIES */
configs.passport() //Configure Passport session

//Configuration of session
app.use(session({
    secret : 'KhanhDo217633519',
    resave: true,
    saveUninitialized: false, 
    rolling: true
}))
//Initialize Passport session
app.use(passport.initialize());
app.use(passport.session());



/* ROUTES */
const user = require('./routes/user.js')
const auth = require('./routes/auth.js')
const expert = require('./routes/expert.js')
const payment = require('./routes/payment.js')
const task = require('./routes/task.js')

app.use('/', user)
app.use('/auth', auth)
app.use('/expert', expert)
app.use('/payment', payment)
app.use('/task', task)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


//Start app on port
app.listen(port, function (req, res){
    console.log("Server is running on port " + port.toString())
})
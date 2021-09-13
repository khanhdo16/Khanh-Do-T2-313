const express = require("express")
const passport = require("passport")
const session = require('express-session')
const date = require('datejs')
const {users, experts, emails} = require("./actions.js")
const configs = require("./configs.js")
const { payment } = require("./payment.js")
const app = express()

var port = process.env.PORT || 5000

configs.database()
configs.passport()

//Parse request as JSON
app.use(express.json())
//Set static assets folder
app.use(express.static(__dirname + "/public", {
    index: false,
}))
//Configuration of session
app.use(session({
    secret : 'KhanhDo217633519',
    resave: false,
    saveUninitialized: false, 
  }))
app.use(passport.initialize());
app.use(passport.session());


//Home route: Sign in page
app.route('/')
    .get((req,res)=>{
        if(req.user) {
            res.redirect('/custtask.html')
        }
        else {
            res.status(200).sendFile(__dirname + "/views/custsignin.html")
        }
    })
    .post((req, res, next) => {
        users.authenticate(req, res, next)
    })

//Sign in with Google
app.get('/auth/google', users.google.authenticate())

app.get('/auth/google/redirect', (req, res, next) => {
    users.google.callback(req, res, next)
})

//Update profile after google sign up
app.route('/google-signup.html')
    .get((req, res) => {
        res.sendFile(__dirname + "/views/google-signup.html")
    })
    .post((req, res) => {
        users.google.register(req, res)
    })
    
//Sign up route
app.route('/custsignup.html')
    .get((req,res) => {
        if(req.user) {
            res.status(200).redirect('/custtask.html')
        }
        else {
            res.status(200).sendFile(__dirname + "/views/custsignup.html")
        }
    })
    .post((req, res) => {
        users.register(req.body, res)
    })

//Customer task route
app.get('/custtask.html', (req,res) => {
    if(req.user) {
        res.status(200).sendFile(__dirname + "/views/custtask.html")
    }
    else {
        res.status(400).redirect('/')
    }
})

//Customer forgot password route
app.route('/custforgot.html')
    .get((req, res) => {
        res.sendFile(__dirname + "/views/custforgot.html")
    })
    .post((req, res) => {
        emails.sendResetLink(req.body.email)
        res.sendStatus(200)
    })

//Let customer reset password
app.route('/resetpassword')
    .get((req, res) => {
        users.validateResetToken(req.query.token, res)
    })
    .post((req, res) => {
        users.resetPassword(req.query.token, req.body, res)
    })

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


//Experts REST API
//Retrieve, create, delete expert(s)
app.route('/experts')
    .get((req, res) => {
        experts.retrieve(res)
    })
    .post((req, res) => {
        experts.register(req.body, res)
    })
    .delete((req, res) => {
        experts.delete(res)
    })

//Retrieve, update, delete specific expert
app.route('/experts/:id')
    .get((req, res) => {
        experts.getById(req.params.id, res)
    })
    .patch((req, res) => {
        experts.updateById(req.params.id, req.body, res)
    })
    .delete((req, res) => {
        experts.deleteById(req.params.id, res)
    })


app.get('/create-payment-intent', (req, res) => {
    payment.createIntent(res)
}) 


//Start app on port
app.listen(port, function (req, res){
    console.log("Server is running on port " + port.toString())
})
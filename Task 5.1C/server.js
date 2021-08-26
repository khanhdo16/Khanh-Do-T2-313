const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const validator = require("validator")
const uniqueValidator = require('mongoose-unique-validator');
const https = require('https')
const app = express()

const bcrypt = require('bcrypt');
const { ifError } = require("assert");
const saltRounds = 10

mongoose.connect('mongodb://localhost:27017/iServiceDB', {useNewUrlParser: true})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  console.log('Established connection to database!')
});

app.use(express.static(__dirname + "/public", {
    index: false,
}))

let password = '';

const userSchema = new mongoose.Schema({
    country: {
        type: String,
        required: [true, 'This field is required!']
    },
    fname: {
        type: String,
        trim: true,
        uppercase: true,
        required: [true, 'This field is required!']
    },
    lname: {
        type: String,
        trim: true,
        uppercase: true,
        required: [true, 'This field is required!']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        index: true,
        unique: true,
        required: [true, 'This field is required!'],
        validate: (value) => {
            if(!validator.isEmail(value)) {
                throw new Error('Email is not valid!')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'This field is required!'],
        validate: (value) => {
            password = value;

            if(!validator.isStrongPassword(value)) {
                throw new Error('Password is weak! Make sure it is at least 8 characters and contains: 1 upper, 1 lower, 1 number, 1 symbol.')
            }
        }
    },
    confirmpassword: {
        type: String,
        trim: true,
        required: [true, 'This field is required!'],
        validate: (value) => {
            if(!validator.equals(value, password)) {
                throw new Error('Passwords do not match!')
            }
        }
    },
    address: {
        type: String,
        trim: true,
        required: [true, 'This field is required!'],
    },
    address2: {
        type: String,
        trim: true,
        required: false,
    },
    city: {
        type: String,
        trim: true,
        required: [true, 'This field is required!'],
    },
    state: {
        type: String,
        trim: true,
        required: [true, 'This field is required!'],
    },
    postal: {
        type: String,
        trim: true,
        required: false,
        validate: (value) => {
            if(!validator.isEmpty(value) && !validator.isPostalCode(value, 'any')) {
                throw new Error('Postal code is invalid!')
            }
        }
    },
    phone: {
        type: String,
        trim: true,
        required: false,
        validate: (value) => {
            if(!validator.isEmpty(value) && !validator.isMobilePhone(value)) {
                throw new Error('Phone number is invalid!')
            }
        }
    }
});

userSchema.pre('save', function(next) {
    let user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
})

userSchema.methods.comparePassword = function(plaintextPassword, callback) {
    bcrypt.compare(plaintextPassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

userSchema.plugin(uniqueValidator, { message: 'This {PATH} has already been taken!' });

const User = mongoose.model('User', userSchema)

app.use(bodyParser.json())

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/custsignin.html")
})

app.get('/custsignup.html', (req,res)=>{
    res.sendFile(__dirname + "/custsignup.html")
})

app.get('/custtask.html', (req,res)=>{
    res.sendFile(__dirname + "/custtask.html")
})

app.post('/', (req, res) => {
    const data = req.body
    const message = 'You have entered an invalid username or password.'

    User.findOne({email: data.email}, function(err, user) {
        if(err) {
            res.status(400)
            res.send(message)
        }
        else {
            user.comparePassword(data.password, function(err, isMatch) {
                if(!isMatch) {
                    res.status(400)
                    res.send(message)
                }
                else {
                    res.sendStatus(200)
                }
            })
        }
    })
})

app.post('/custsignup.html', (req, res) => {
    const user = new User(req.body)

    user.save(function(err) {
        if(err) {
            let data = {}
            let errors = err.errors

            for(const [key, value] of Object.entries(errors)) {
                data[key] = value.message
            }
            
            res.header('Content-Type', 'application/json')
            res.status(400)
            res.send(JSON.stringify(data))
        }
        else {
            const fname = req.body.fname
            const lname = req.body.lname
            const email = req.body.email
            const data = {
                members:[{
                    email_address: email,
                    status : "subscribed",
                    merge_fields:{
                        FNAME: fname,
                        LNAME: lname
                    }
                }]
            }

            jsonData = JSON.stringify(data)
            
            const url= "https://us5.api.mailchimp.com/3.0/lists/593205e619"
            const options = {
                method:"POST",
                headers:{
                    Authorization: 'Bearer e99322ab35f507eb76ff190c1d2c8b87-us5'            
                }
            }


            const request = https.request(url, options , (response)=>{
                response.on("data", (data)=> {
                    console.log(JSON.parse(data))
                })
            })

            request.write(jsonData)
            request.end()
            res.sendStatus(200)
        }
    })
})

app.listen(3000, function (request, response){
    console.log("Server is running on port 3000")
})
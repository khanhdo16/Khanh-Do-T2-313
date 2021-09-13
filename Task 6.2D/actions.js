const mongoose = require("mongoose")
const passportLocalMongoose = require ('passport-local-mongoose')
const passport = require("passport")
const date = require("datejs")
const crypto = require('crypto')
const sendgrid = require('@sendgrid/client')
const keys = require('./key.js')
const validator = require('validator')


const User = require("./models/User.js")
const Expert = require("./models/Expert.js")
const { isBuffer } = require('util')


//User actions
const users = {
    //Authenticate user with the request data
    authenticate: function(request, response, next) {
        passport.authenticate('local',
        (err, user, info) => {
            if (err) {
                response.status(400).json({message: 'Something went wrong, please try again later.'})
            }
            else {
                if (!user) {
                    response.status(400).json({message: 'You have entered an invalid username or password.'})
                }
                else {
                    request.logIn(user, function(err) {
                        if (err) {
                            response.status(400).json({message: 'You have entered an invalid username or password.'})
                        }
                        else {
                            if(request.body.rememberMe) {
                                request.session.cookie.expires = Date.today().setTimeToNow().addMonths(1)
                            }
                            else {
                                request.session.cookie.maxAge = null
                            }
                            response.status(200).json({message: "Signed in successfully!"})
                        }
                    })
                }
            }
        })(request, response, next)
    },
    //Register user with the request data
    register: function(userData, response) {
        User.register(userData, userData.password, (err) => {
            if (err) {
                let data = {}
                let errors = err.errors
    
                for(const [key, value] of Object.entries(errors)) {
                    data[key] = value.message
                }
                
                response.status(400)
                response.json(data)
            }
            else {
                emails.subscribe(userData)
    
                response.status(200)
                response.json({message: "Signed up successfully!"})
            }
        })
    },
    //Generate password reset token and update to database
    generateResetToken: async function(email) {
        let result = null

        await User.findOneAndUpdate(
            {email: email},
            {
                resetToken: generateResetToken(),
                resetDate: Date.today().setTimeToNow().addDays(1)
            },
            {new: true},
            (err, user) => {
                if(err) {
                    console.log(err)
                }
                if(user) {
                    result = user
                }
            }
        )

        return result
    },
    //Function to validate reset token
    validateResetToken: function(token, response) {
        if(token) {
            User.findOne({resetToken: token}, (err, user) => {
                if(err) {
                    return response.status(400).json({message: "Invalid reset link, please try to request password reset again!"})
                }
                if(user) {
                    const linkExpired = Date.compare(Date.today().setTimeToNow(), user.resetDate)
                    if(linkExpired < 0) {
                        return response.status(200).sendFile(__dirname + "/views/resetpassword.html")
                    }
                    return response.status(400).json({message: "Link expired, please try to request password reset again!"})
                }
                return response.status(400).json({message: "Invalid reset link, please try to request password reset again!"})
            })
        }
        else {
            response.redirect("/")
        }
    },
    //Function to reset user password
    resetPassword: function(token, updateData, response) {
        if(token) {
            User.findOne({resetToken: token}, (err, user) => {
                err = comparePassword(err, updateData)

                if(err) {
                    let data = {}
                    let errors = err.errors
        
                    for(const [key, value] of Object.entries(errors)) {
                        data[key] = value.message
                    }
                    
                    response.status(400)
                    response.json(data)
                }
                else if(user) {
                    const linkExpired = Date.compare(Date.today().setTimeToNow(), user.resetDate)
                    if(linkExpired < 0) {
                        user.authenticate(updateData.password, async (err, result) => {
                            if(result) {
                                return response.status(400).json({message: "Password can't be previously used!"})
                            }
                            else {
                                await user.setPassword(updateData.password)
                                await user.save({ validateBeforeSave: false })
                                return response.status(200).json({message: "Reset password succesfully!"})
                            }
                        })
                    }
                    else return response.status(400).json({message: "Link expired, please try to request password reset again!"})
                }
                else {
                    return response.status(400).json({message: "Invalid reset link, please try to request password reset again!"})
                }
            })
        }
        else {
            return response.status(400).json({message: "Invalid reset link, please try to request password reset again!"})
        }
    },
    //Sign up with Google actions
    google: {
        authenticate: function() {
            return passport.authenticate('google', { scope: ['email', 'profile'] })
        },
        callback: function(request, response, next) {
            return passport.authenticate('google', function(err, user, info) {
                if (err) { return next(err) }
                if (!user) { return response.redirect('/') }
                request.logIn(user, function(err) {
                    if (err) { return next(err) }
                    request.session.cookie.expires = Date.today().setTimeToNow().addMonths(1)
                    if(request.user.address == 'N/A' || request.user.city == 'N/A' || request.user.state == 'N/A' || request.user.country == 'N/A') {
                        return response.redirect('/google-signup.html')
                    }
                    return response.redirect('/custtask.html')
                });
            })(request, response, next)
        },
        //Function to update details for account signed up with Google
        register: function(request, response) {
            User.findByIdAndUpdate(
                request.user._id,
                request.body,
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
                        response.json({message: "Signed up successfully!"})
                    }
            })
        }
    }
}

//Setup authentication for Sendgrid
sendgrid.setApiKey(keys.sendgrid)

//Email actions
const emails = {
    //Function to send password reset link user
    sendResetLink: async function(email) {
        let user = await users.generateResetToken(email)

        if(user && user.resetToken) {
            const data = {
                "from": {
                    "email" : "hellothesun20@gmail.com",
                    "name": "iService"
                },
                "personalizations": [
                    {
                        "dynamic_template_data": {
                            "reset_link": "https://sit313-khanhdo-iservice.herokuapp.com/resetpassword/?token=" + user.resetToken
                        },
                        "to": [
                            {
                              "email": email,
                            }
                          ]
                    }
                ],
                "template_id": "d-4068a8dca0b5486787669c0bc8a8595b"
            }
            
            const request = {
                body: data,
                method: 'POST',
                url: '/v3/mail/send'
            }
    
            sendgrid.request(request)
            .then((response, err) => {
                if(err) console.log(err)
            })
        }
    },
    //Function to subscribe user to mailing list
    subscribe: function(userData) {
        const data = [
            {
                "email": userData.email,
                "first_name": userData.fname,
                "last_name": userData.lname
            }
        ]
        
        const request = {
            body: data,
            method: 'PUT',
            url: '/v3/marketing/contacts'
        }

        sendgrid.request(request)
        .then((response, err) => {
            if(err) console.log(err)
        })
    }
}

//Expert actions
const experts = {
    //Retrieve all experts from database
    retrieve: function(response) {
        Expert.find((err, experts) => {
            if(!err) {
                if(experts.length > 0) {
                    response.status(200)
                    response.json(experts)
                }
                else {
                    response.status(400)
                    response.json({message: "No experts found!"})
                }
            }
            else {
                console.log(err)
                response.status(400)
                response.json({message: "No experts found!"})
            }
        })
    },
    //Register expert with request data
    register: function(expertData, response) {
        const expert = new Expert(expertData)

        expert.confirmpassword = expertData.confirmpassword || ''

        expert.save((err) => {
            if(err) {
                console.log(err)
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
                response.json({message: "Expert created successfully!"})
            }
        })
    },
    //Delete all experts from database
    delete: function(response) {
        Expert.deleteMany((err) => {
            if(!err) {
                response.status(200)
                response.json({message: "All experts deleted successfully!"})
            }
            else {
                console.log(err)
                response.status(400)
                response.json({message: "Failed to delete experts!"})
            }
        })
    },
    //Retrieve single expert by id
    getById: function(id, response) {
        Expert.findById(
            id, 
            (err, expert) => {
                if(!err) {
                    response.status(200)
                    response.json(expert)
                }
                else {
                    console.log(err)
                    response.status(400)
                    response.json({message: "The expert does not exist!"})
                }
        })
    },
    //Update single expert by id
    updateById: function(id, updateData, response) {
        Expert.findByIdAndUpdate(
            id,
            updateData,
            {
                runValidators: true,
                context: 'query'
            },
            (err) => {
                err = comparePassword(err, updateData)
    
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
                    response.json({message: "Expert updated successfully!"})
                }
        })
    },
    //Delete single expert by id
    deleteById: function(id, response) {
        Expert.findByIdAndDelete(
            id,
            (err) => {
                if(!err) {
                    response.status(200)
                    response.json({message: "Expert deleted successfully!"})
                }
                else {
                    console.log(err)
                    response.status(400)
                    response.json({message: "Failed to delete the expert!"})
                }
        })
    }
}

//Function to generate reset token
function generateResetToken() {
    let token = crypto.randomBytes(64).toString('hex')
    return token
}

//Compare password and confirmation
function comparePassword(err, updateData) {
    const password = updateData.password
    const confirm = updateData.confirmpassword
    const required = {message: 'This field is required!'}
    const weak = {message: 'Password is weak! Make sure it is at least 8 characters and contains: 1 upper, 1 lower, 1 number, 1 symbol.'}
    const match = {message: 'Passwords don\'t match'}

    if(!err) {
        err = { errors: {} }
    }
    if(!password) {
        err.errors['password'] = required
    }
    if(!confirm) {
        err.errors['confirmpassword'] = required
    }
    if(password && confirm) {
        const validPassword = validator.isStrongPassword(password)
        const validConfirm = validator.isStrongPassword(confirm)
        if(!validPassword) {
            err.errors['password'] = weak
        }
        if(!validConfirm) {
            err.errors['confirmpassword'] = weak
        }
        if(validPassword && validConfirm) {
            if(password != confirm) {
                err.errors['password'] = err.errors['confirmpassword'] = match
            }
        }
    }

    if(err.errors && Object.keys(err.errors).length === 0) err = null

    return err
}

module.exports = {
    users,
    experts,
    emails
}
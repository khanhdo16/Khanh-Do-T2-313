const mongoose = require("mongoose")
const passportLocalMongoose = require ('passport-local-mongoose')
const passport = require("passport")
const date = require("datejs")

const validator = require('validator')
const keys = require('../key.js')

const User = require("../../models/User.js")

const emails = require('./emails.js')

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

//User actions
const users = {
    //Authenticate user with the request data
    authenticate: function(request, response, next) {
        passport.authenticate('user',
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
                                request.session.cookie.expires = false
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
    
                if(!errors) {
                    if(err.message) {
                        data['error'] = err.message
                    }
                }
                else {
                    for(const [key, value] of Object.entries(errors)) {
                        data[key] = value.message
                    }
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
                        return response.status(200).json({message: "Valid reset link!"})
                    }
                    return response.status(400).json({message: "Link expired, please try to request password reset again!"})
                }
                return response.status(400).json({message: "Invalid reset link, please try to request password reset again!"})
            })
        }
        else {
            response.redirect(keys.host)
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
                                await user.updateOne({resetToken: ''})
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
                        return response.redirect(keys.host + "/google/signup")
                    }
                    return response.redirect(keys.host + '/google/signin')
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
    },
    //Retrieve single user by id
    getById: function(id, response) {
        User.findById(
            id, 
            (err, user) => {
                if(!err) {
                    response.status(200)
                    response.json(user)
                }
                else {
                    console.log(err)
                    response.status(400)
                    response.json({message: "The user does not exist!"})
                }
        })
    },
    //Update single user by id
    updateById: function(id, updateData, response) {
        User.findByIdAndUpdate(
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
                    response.json({message: "User updated successfully!"})
                }
        })
    },
}

module.exports = users
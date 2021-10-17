const mongoose = require("mongoose")
const passport = require("passport")
const date = require("datejs")
const crypto = require('crypto')
const validator = require('validator')
const emails = require('./emails')

const Expert = require("../../models/Expert.js")


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
    //Authenticate expert with the request data
    authenticate: function(request, response, next) {
        passport.authenticate('expert',
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
    //Register expert with request data
    register: function(expertData, response) {
        Expert.register(expertData, expertData.password, (err) => {
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
                emails.subscribe(expertData)
    
                response.status(200)
                response.json({message: "Signed up successfully!"})
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
                if(updateData.password || updateData.confirmpassword) {
                    err = comparePassword(err, updateData)
                }
    
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

module.exports = experts
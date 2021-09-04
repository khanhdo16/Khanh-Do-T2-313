const https = require('https')
const mongoose = require("mongoose")

const User = require("./models/User.js")
const Expert = require("./models/Expert.js")

//Authenticate user with the request data
function authenticateUser(userData, response) {
    const errMessage = 'You have entered an invalid username or password.'

    User.findOne({email: userData.email}, function(err, user) {
        if(err) {
            console.log(err)
            response.status(400)
            response.json({message: errMessage})
        }
        else {
            if(user != null) {
                user.comparePassword(userData.password, function(err, isMatch) {
                    if(!isMatch) {
                        response.status(400)
                        response.json({message: errMessage})
                    }
                    else {
                        response.status(200)
                        response.json({message: "Signed in successfully!"})
                    }
                })
            }
            else {
                response.status(400)
                response.json({message: errMessage})
            }
        }
    })
}

//Register user with the request data
function registerUser(userData, response) {
    const user = new User(userData)
    
    user.confirmpassword = userData.confirmpassword || ''

    user.save((err) => {
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
            subscribeToMailChimp(userData)

            response.status(200)
            response.json({message: "Signed up successfully!"})
        }
    })
}

//Subscribe user to Mailchimp list
function subscribeToMailChimp(userData) {
    const fname = userData.fname
    const lname = userData.lname
    const email = userData.email

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
}

//Retrieve all experts from database
function retrieveExperts(response) {
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
}

//Register expert with request data
function registerExpert(expertData, response) {
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
}

//Register all experts from database
function deleteExperts(response) {
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
}

//Retrieve single expert by id
function getExpertById(id, response) {
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
}

//Update single expert by id
function updateExpertById(id, updateData, response) {
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
}

//Compare password and confirmation
function comparePassword(err, updateData) {
    if(updateData.password) {
        if (!updateData.confirmpassword) {
            if (err == null) {
                err = {
                    errors: {
                        confirmpassword: {message: 'This field is required!'}
                    }
                }
            }
            else {
                err.errors['confirmpassword'] = {message: 'This field is required!'}
            }
        }
        else {
            if (updateData.password !== updateData.confirmpassword) {
                if (err == null) {
                    err = {
                        errors: {
                            confirmpassword: {message: 'Passwords do not match'}
                        }
                    }
                }
                else {
                    err.errors['confirmpassword'] = {message: 'Passwords do not match'}
                }
            }
        }    
    }
    return err
}

//Delete single expert by id
function deleteExpertById(id, response) {
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

exports.authenticateUser = authenticateUser
exports.registerUser = registerUser
exports.retrieveExperts = retrieveExperts
exports.registerExpert = registerExpert
exports.deleteExperts = deleteExperts
exports.getExpertById = getExpertById
exports.updateExpertById = updateExpertById
exports.deleteExpertById = deleteExpertById
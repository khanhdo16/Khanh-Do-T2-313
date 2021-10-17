const sendgrid = require('@sendgrid/client')
const keys = require('../key.js')
const users = require('./users.js')
const crypto = require('crypto')
const User = require("../../models/User.js")

//Setup authentication for Sendgrid
sendgrid.setApiKey(keys.sendgrid)

//Email actions
const emails = {
    //Function to send password reset link user
    sendResetLink: async function(email) {
        let user = await generateResetToken(email)
        
        if(user && user.resetToken) {
            const data = {
                "from": {
                    "email" : "hellothesun20@gmail.com",
                    "name": "iService"
                },
                "personalizations": [
                    {
                        "dynamic_template_data": {
                            "reset_link": keys.host + "/resetpassword/?token=" + user.resetToken
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
        const data = {
            contacts: [
                {
                    "email": userData.email,
                    "first_name": userData.fname,
                    "last_name": userData.lname
                }
            ]
        }
        
        const request = {
            body: data,
            method: 'PUT',
            url: '/v3/marketing/contacts'
        }

        sendgrid.request(request)
        .then((response, err) => {
            if(err) console.log(err)
            console.log(response)
        })
        .catch((err) => console.log(err.response.body.errors))
    }
}

//Function to generate reset token
function getResetToken() {
    let token = crypto.randomBytes(64).toString('hex')
    return token
}

//Set reset token
async function generateResetToken(email) {
    let result = null

    await User.findOneAndUpdate(
        {email: email},
        {
            resetToken: getResetToken(),
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
}

module.exports = emails
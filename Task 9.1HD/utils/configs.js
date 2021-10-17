const mongoose = require("mongoose")
const passportjs = require('passport')
const faker = require('faker')
const keys = require('./key.js')

const User = require("../models/User.js")
const Expert = require("../models/Expert.js")
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//Function to set up MongoDB Atlas
function database() {
    //Establish connection to MongoDB
    mongoose.connect(
        keys.mongoAtlas,
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
}

//Function to set up PassportJS
function passport() {
    passportjs.use('user', User.createStrategy())
    passportjs.use('expert', Expert.createStrategy())
    passportjs.use(new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: keys.host + '/auth/google/redirect'
    },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({email: profile.emails[0].value}, (err, user) => {
                if(!user) {
                    const password = faker.internet.password()

                    const userData = {
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        fname: profile.name.givenName,
                        lname: profile.name.familyName,
                        address: 'N/A',
                        city: 'N/A',
                        state: 'N/A',
                        country: 'N/A',
                        confirmpassword: password
                    }
                    
                    User.register(userData, password, (err, result) => {
                        if (err) {
                            console.log(err)
                            return done(err, null)
                        }
                        if (result) {
                            return done(err, result);
                        }
                    })
                }
                else {
                    if(!user.googleId) {
                        user.updateOne({$set: {googleId: profile.id}}, (err) => {
                            if(err) {
                                console.log(err)
                                return done(err, null)
                            }
                        })
                    }
                    else return done(err, user)
                }
            })
    }
    ));
    passportjs.serializeUser((obj, done) => {
        if(obj != null) {
            done(null, obj)
        }
        else {
            done(new Error('Invalid user.'), null)
        }
    })
    passportjs.deserializeUser((obj, done) => {
        if(obj != null) {
            done(null, obj)
        }
        else {
            done(new Error('Invalid user.'), null)
        }
    })
}

module.exports = {
    database,
    passport
}
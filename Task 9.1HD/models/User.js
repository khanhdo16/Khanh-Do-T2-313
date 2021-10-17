const mongoose = require('mongoose')
const passportLocalMongoose = require ('passport-local-mongoose')
const validator = require("validator")
const uniqueValidator = require('mongoose-unique-validator')

const requiredMsg = 'Field {PATH} is required!'
var tempPassword;

//Schema for User
const userSchema = new mongoose.Schema({
    country: {
        type: String,
        required: [true, requiredMsg]
    },
    fname: {
        type: String,
        trim: true,
        uppercase: true,
        required: [true, requiredMsg]
    },
    lname: {
        type: String,
        trim: true,
        uppercase: true,
        required: [true, requiredMsg]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        index: true,
        unique: true,
        required: [true, requiredMsg],
        validate: (value) => {
            if(!validator.isEmail(value)) {
                throw new Error('Email is not valid!')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: [true, requiredMsg],
        validate: (value) => {
            if(!validator.isStrongPassword(value)) {
                throw new Error('Password is weak! Make sure it is at least 8 characters and contains: 1 upper, 1 lower, 1 number, 1 symbol.')
            }
        }
    },
    address: {
        type: String,
        trim: true,
        required: [true, requiredMsg],
    },
    address2: {
        type: String,
        trim: true,
        required: false,
        validate: (value) => {
            if(value == null) {
                throw new Error('Null is not allowed!')
            }
        }
    },
    city: {
        type: String,
        trim: true,
        required: [true, requiredMsg],
    },
    state: {
        type: String,
        trim: true,
        required: [true, requiredMsg],
    },
    postal: {
        type: String,
        trim: true,
        required: false,
        validate: (value) => {
            if(value == null) {
                throw new Error('Null is not allowed!')
            }
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
            if(value == null) {
                throw new Error('Null is not allowed!')
            }
            if(!validator.isEmpty(value) && !validator.isMobilePhone(value)) {
                throw new Error('Phone number is invalid!')
            }
        }
    },
    googleId: String,
    resetToken: {
        type: String
    },
    resetDate: {
        type: Date,
    }
})

//Validate if password and confirmation matched
userSchema.pre('validate', function(next) {
    if (!this.confirmpassword) {
        this.invalidate('confirmpassword', requiredMsg)
    }
    if (tempPassword != this.confirmpassword) {
        this.invalidate('password', 'Passwords do not match!')
        this.invalidate('confirmpassword', 'Passwords do not match!')
    }
    next()
})

//Virtual field for password confirmation
userSchema.virtual('confirmpassword')
    .get(function() {
    return this._confirmpassword
    })
    .set(function(value) {
        this._confirmpassword = value
    })

userSchema.plugin(uniqueValidator, { message: 'This {PATH} has already been taken!' })
userSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        MissingUsernameError: 'Field email is required!',
        MissingPasswordError: 'Field password is required!',
        UserExistsError: 'This email has already been taken!',
        IncorrectUsernameError: 'Incorrect email or password.',
        IncorrectPasswordError: 'Incorrect email or password.'
    },
    usernameField: 'email',
    usernameCaseInsensitive: true,
    usernameUnique: false,
    usernameLowerCase: true,
    hashField: 'password',
    passwordValidator: (password, cb) => {
        tempPassword = password
        return cb()
    }
})

module.exports = mongoose.model("User", userSchema)
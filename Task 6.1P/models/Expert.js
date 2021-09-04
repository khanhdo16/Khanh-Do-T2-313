const mongoose = require('mongoose')
const validator = require("validator")
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')

const saltRounds = 10
const requiredMsg = 'This field is required!'

//Schema for Expert
const expertSchema = new mongoose.Schema({
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
    department: {
        type: String,
        trim: true,
        required: [true, requiredMsg]
    },
    position: {
        type: String,
        trim: true,
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
        validate: (password) => {
            if(!validator.isStrongPassword(password)) {
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
    }
})

//Virtual field for password confirmation
expertSchema.virtual('confirmpassword')
    .get(function() {
    return this._confirmpassword
    })
    .set(function(value) {
        this._confirmpassword = value
    })

//Hashing password before saving
expertSchema.pre(['save', 'findOneAndUpdate'], function(next) {
    const expert = this.password ? this : this._update

    if (!expert.password) return next()

    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return next(err)

        bcrypt.hash(expert.password, salt, function(err, hash) {
            if (err) return next(err)
            expert.password = hash
            next()
        })
    })
})

//Validate if password and confirmation matched
expertSchema.pre('validate', function(next) {
    if (this.confirmpassword === "") {
        this.invalidate('confirmpassword', requiredMsg)
    }
    else {
        if (this.password !== this.confirmpassword) {
            this.invalidate('confirmpassword', 'Passwords do not match')
        }
    }
    next()
})

//Compare hashed passwords
expertSchema.methods.comparePassword = function(plaintextPassword, callback) {
    bcrypt.compare(plaintextPassword, this.password, function(err, isMatch) {
        if (err) return callback(err)
        callback(null, isMatch)
    })
}

expertSchema.plugin(uniqueValidator, { message: 'This {PATH} has already been taken!' })

module.exports = mongoose.model("Expert", expertSchema)
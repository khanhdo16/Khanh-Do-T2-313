const express = require('express')
const User = require('../models/User.js')
const router = express.Router()
const keys = require('../utils/key.js')

const {users} = require("../utils/actions")

/* AUTHENTICATED */
router.get('/', (req, res) => {
    if(req.user) {
        const user = req.user

        const data = {
            _id: user._id,
            email: user.email,
            fname: user.fname,
            lname: user.lname,
            expires: req.session.cookie.expires
        }

        if(user.tasks != null) data.tasks = user.tasks

        res.status(200).json(data)
    }
    else (
        res.sendStatus(401)
    )
})

/* GOOGLE */
//Sign in with Google
router.get('/google', users.google.authenticate())

router.get('/google/redirect', (req, res, next) => {
    users.google.callback(req, res, next)
})

//Update profile after google sign up
router.route('/google/signup')
    .get((req, res) => {
        res.redirect(keys.host + "/google/signup")
    })
    .post((req, res) => {
        users.google.register(req, res)
    })

module.exports = router
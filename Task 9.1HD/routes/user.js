const express = require('express')
const router = express.Router()
const keys = require('../utils/key.js')

const {users, emails, tasks} = require("../utils/actions")

/* HOME PAGE */
router.route('/')
    .post((req, res, next) => {
        users.authenticate(req, res, next)
    })

/* SIGN IN */
router.post('/signin', (req, res, next) => {
    users.authenticate(req, res, next)
})

/* SIGN UP */
router.route('/signup')
    .post((req, res) => {
        users.register(req.body, res)
    })

/* LOGOUT */
router.get('/logout', (req, res) => {
    req.logout()
    res.sendStatus(200)
})

/* FORGOT PAGE */
router.route('/forgot')
    .post((req, res) => {
        emails.sendResetLink(req.body.email).then().catch(e => console.log(e))
        res.sendStatus(200)
    })

/* RESET PASSWORD */
router.route('/resetpassword')
    .get((req, res) => {
        users.validateResetToken(req.query.token, res)
    })
    .post((req, res) => {
        users.resetPassword(req.query.token, req.body, res)
    })

/* RETRIEVE USER BY ID */
router.route('/user/:id')
    .get((req, res) => {
        users.getById(req.params.id, res)
    })
    .patch((req, res) => {
        users.updateById(req.params.id, req.body, res)
    })

/* RETRIEVE USER TASKS BY ID */
router.route('/user/:id/task')
    .get((req, res) => {
        tasks.retrieveByUser(req, res)
    })

module.exports = router
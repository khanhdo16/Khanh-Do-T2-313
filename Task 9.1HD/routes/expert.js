const express = require('express')
const router = express.Router()

const {experts} = require("../utils/actions")

/* EXPERT APIs */
//Retrieve, create, delete expert(s)
router.route('/')
    .get((req, res) => {
        experts.retrieve(res)
    })
    .delete((req, res) => {
        experts.delete(res)
    })

//Sign in expert
router.post('/signin', (req, res, next) => {
    experts.authenticate(req, res, next)
})

router.post('/signup', (req, res) => {
    experts.register(req.body, res)
})

//Retrieve, update, delete specific expert
router.route('/:id')
    .get((req, res) => {
        experts.getById(req.params.id, res)
    })
    .patch((req, res) => {
        experts.updateById(req.params.id, req.body, res)
    })
    .delete((req, res) => {
        experts.deleteById(req.params.id, res)
    })

module.exports = router
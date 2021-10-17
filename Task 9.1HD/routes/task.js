const express = require('express')
const router = express.Router()

const { tasks } = require('../utils/actions')

/* TASK APIs */
router.route('/')
    .get((req, res) => {
        tasks.retrieve(req, res)
    })
    .post((req, res) => {
        tasks.create(req, res)
    })
    .delete((req, res) => {
        tasks.delete(req, res)
    })

router.patch('/:id', (req, res) => {
    tasks.updateById(req.params.id, req.body, res)
})

router.post('/upload', (req, res) => {
    tasks.upload(req, res)
})

module.exports = router
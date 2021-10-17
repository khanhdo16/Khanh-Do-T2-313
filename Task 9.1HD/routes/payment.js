const express = require('express')
const router = express.Router()

const { payment } = require("../utils/payment.js") //Stripe configuration

/* STRIPE CREATE PAYMENT */
router.post('/create', (req, res) => {
    const { amount, paymentMethod } = req.body
    payment.create(amount, paymentMethod, res)
}) 

module.exports = router
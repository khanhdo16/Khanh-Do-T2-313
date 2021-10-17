const keys = require('./key.js')
const stripe = require('stripe')(keys.stripe)

const payment = {
    create: async function(amount, paymentMethod, response) {
        stripe.paymentIntents.create({
            confirm: true,
            payment_method: paymentMethod.id,
            amount: (Number(amount) * 100),
            currency: 'aud',
            // Verify your integration in this guide by including this parameter
            metadata: {integration_check: 'accept_a_payment'},
        })
        .then((result) => {
            if(result.status === 'succeeded') {
                response.sendStatus(200)
            }
            else {
                response.sendStatus(400)
            }
        })
        .catch(e => {
            response.sendStatus(400)
        })
    }
}

module.exports = {
    payment
}
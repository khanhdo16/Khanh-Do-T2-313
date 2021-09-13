const keys = require('./key.js')
const stripe = require('stripe')(keys.stripe)

// const paymentIntent = async () => {
//     return await stripe.paymentIntents.create({
//         amount: 9.99,
//         currency: 'aud',
//         // Verify your integration in this guide by including this parameter
//         metadata: {integration_check: 'accept_a_payment'},
//     })
// }

const payment = {
    createIntent: async function(response) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 999,
            currency: 'aud',
            // Verify your integration in this guide by including this parameter
            metadata: {integration_check: 'accept_a_payment'},
        })

        response.status(200).json({
            message: "Payment intent created successfully!",
            client_secret: paymentIntent.client_secret
        })
    },
    send: function(user, cardData, response) {
        const name = user.fname + " " + user.lname
        const data = {
            paymentMethod: {
                type: 'card',
                card: {
                    number: cardData.number,
                    exp_month: cardData.month,
                    exp_year: cardData.year,
                    cvc: cardData.cvv,
                },
                billing_details: {
                    name: name
                }
            },
            receipt_email: user.email
        }



        stripe.confirmCardPayment(paymentIntent, data).then((result) => {
            console.log(result)
            response.sendStatus(200)
        })
    }
}

module.exports = {
    payment
}
var stripe = Stripe('pk_test_51HZ0GBABqJ9IhHyXV3GKGG6y9JvnkCB6MUUTlbqZ5mBV6FtyjWUkp8g7pKTmyeOpojBR09SQRmuzjXW1nvyyIpoV00OsTsnbLY');

// const form = document.getElementById('form');

// form.addEventListener('submit', (event) => {
//     event.preventDefault();

//     let fields = form.elements;
//     let data = {};

//     for(let i = 0; i < 5; i++) {
//         data[fields[i].id] = fields[i].value;
//     }

//     const xhttp = new XMLHttpRequest();
//     const message = document.getElementsByClassName('invalid-feedback')[0];

//     xhttp.onreadystatechange = function() {
//         // for(let i = 0; i < 2; i++) {
//         //   fields[i].classList.remove('is-invalid');
//         // }

//         if (this.readyState == 4) {
//             document.getElementById('overlay').style.display = 'none'
//             if (this.status == 400) {
//                 // let json = JSON.parse(this.response)
//                 // message.textContent = json['message'];
//                 // for(let i = 0; i < 2; i++) {
//                 //   fields[i].classList.add('is-invalid');
//                 // }
//             }
//             if (this.status == 200) {
//                 let json = JSON.parse(this.response)

//                 if(json['client_secret']) {
//                     sendPayment(json['client_secret'], data)
//                 }
//             }
//         }
//     };

//     xhttp.open("GET", "/create-payment-intent");
//     xhttp.setRequestHeader("Content-type", "application/json", true);
//     xhttp.send();

//     document.getElementById('overlay').style.display = "flex";
// })

// function sendPayment(client_secret, cardData) {
//     const data = {
//         payment_method: {
//             type: 'card',
//             card: {
//                 number: cardData.cardnumber,
//                 exp_month: Number(cardData.month),
//                 exp_year: Number(cardData.year),
//                 cvc: cardData.cvv,
//             },
//             billing_details: {
//                 name: cardData.name
//             }
//         }
//     }

//     console.log(data)

//     stripe.confirmCardPayment(client_secret, data).then((result) => {
//         document.getElementById('overlay').style.display = "none";
//         console.log(result)
//         if (result.error) {
//         // Show error to your customer (e.g., insufficient funds)
//         console.log(result.error.message);
//         } else {
//         // The payment has been processed!
//             if (result.paymentIntent.status === 'succeeded') {
//                 // Show a success message to your customer
//                 // There's a risk of the customer closing the window before callback
//                 // execution. Set up a webhook or plugin to listen for the
//                 // payment_intent.succeeded event that handles any business critical
//                 // post-payment actions.
//             }
//         }
//     });
// }


var elements = stripe.elements();
var style = {
    base: {
        // Add your base input styles here. For example:
        fontSize: '16px',
        color: '#32325d',
    },
};

var card = elements.create('card', {style: style});
card.mount('#card-element');

const form = document.getElementById('form');
const overlay = document.getElementById('overlay')

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    overlay.style.display = 'flex';

    const xhttp = new XMLHttpRequest();
    
    xhttp.onload = function() {
        if (this.status == 200) {
            let json = JSON.parse(this.response)
            sendPayment(json['client_secret'], form.elements.name.value)
        }
    };

    xhttp.open("GET", "/create-payment-intent");
    xhttp.setRequestHeader("Content-type", "application/json", true);
    xhttp.send();

    
});

function sendPayment(clientSecret, name) {
    stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
            billing_details: {
            name: name
            }
        }
        }).then(function(result) {
        overlay.style.display = 'none';
        if (result.error) {
            const alert = document.getElementById('alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                result.error.message +
                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
            new bootstrap.Alert(alert);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                alert('Payment completed!')
            }
        }
        });
}


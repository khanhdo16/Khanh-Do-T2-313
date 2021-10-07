const mongoose = require("mongoose")

//Function to set up MongoDB Atlas
function database() {
    //Establish connection to MongoDB
    mongoose.connect(
        'mongodb://localhost:27017/iServiceDB',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    )

    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'Connection error:'))
    db.once('open', function() {
        console.log('Established connection to database!')
    })
}

module.exports = {
    database
}
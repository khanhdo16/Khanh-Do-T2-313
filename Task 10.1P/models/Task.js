const mongoose = require('mongoose')

const requiredMsg = 'Task {PATH} is required'

//Schema for Task
const taskSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, requiredMsg],
        enum: ['in_person', 'online']
    },
    title: {
        type: String,
        trim: true,
        required: [true, requiredMsg]
    },
    description: {
        type: String,
        trim: true,
        required: [true, requiredMsg]
    },
    suburb: {
        type: String,
        trim: true,
        required: [function() {
            if(this.type === 'in_person') return true
            if(this.type === 'online' || this.type === '') return false
        }, requiredMsg]
    },
    date: {
        type: Date,
        required: [true, requiredMsg]
    },
    price_type: {
        type: String,
        required: [true, 'Task price type is required'],
        enum: ['total', 'hourly']
    },
    amount: {
        type: Number,
        required: [true, requiredMsg],
        min: [1, 'The amount you entered is invalid']
    }
})

module.exports = mongoose.model("Task", taskSchema)
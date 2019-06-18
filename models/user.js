const mongoose = require('mongoose')

const Schema = mongoose.Schema

//User schema
const userSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    role: {
        type: String,
        default: 'regular',
        enum: ['regular', 'admin']
    },
    signupDate: {
        type: Date,
        default: Date.now
    },
    lastLoginDate: {
        type: Date
    }
})

//User model
const User = mongoose.model('User', userSchema)

module.exports = User
const mongoose = require('mongoose')

const Schema = mongoose.Schema

//Register schema
const registerSchema = new Schema({
    registerName: {
        type: String
    },
    emailGenerated: {
        type: String
    },
    binUrl: {
        type: String
    },
    passwordGenerated: {
        type: String
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
})

//Register model
const Register = mongoose.model('Register', registerSchema)

module.exports = Register
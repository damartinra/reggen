const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generator = require('generate-password')
var getJSON = require('get-json')

const router = express.Router()

//User model
const User = require('../models/user.js')

//Signup validator
const signupSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().allow('').optional(),
    password: Joi.string().regex(/(^(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))/).min(8).required(),
    confirmPassword: Joi.string().regex(/(^(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))/).min(8).required()
})

//Login validator
const loginSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/(^(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))/).min(8).required()
})

//Sign token
function createTokenSendResponse(user, res, next) {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
    jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '30d'
    }, (err, token) => {
        if (err) {
            const error = new Error('Unable to login.')
            res.status(422)
            next(error)
        } else {
            res.json({ token })
        }
    })
}

//Signup
router.post('/signup', (req, res, next) => {
    const result = Joi.validate(req.body, signupSchema)
    if (result.error === null) {
        User.findOne({ username: req.body.username }).then(user => {
            if (user) {
                const error = new Error('Username already exists.')
                res.status(409)
                next(error)
            } else {
                bcrypt.hash(req.body.password, 10).then(hashedPass => {
                    const user = new User({
                        username: req.body.username,
                        password: hashedPass,
                        email: req.body.email,
                        lastLoginDate: new Date()
                    })
                    user.save().then(insertedUser => {
                        createTokenSendResponse(insertedUser, res, next)
                    })
                })
            }
        })
    } else {
        res.status(422)
        next(result.error)
    }
})

//Login
router.post('/login', (req, res, next) => {
    const result = Joi.validate(req.body, loginSchema)
    if (result.error === null) {
        User.findOne({ username: req.body.username }).then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password).then(result => {
                    if (result) {
                        user.lastLoginDate = new Date()
                        user.save()
                        createTokenSendResponse(user, res, next)
                    } else {
                        const error = new Error('Password incorrect.')
                        res.status(401)
                        next(error)
                    }
                })
            } else {
                const error = new Error('Username does not exist.')
                res.status(401)
                next(error)
            }
        })
    } else {
        const error = new Error('Unable to login.')
        res.status(422)
        next(error)
    }
})

//Password generator
router.post('/passwordGenerator', (req, res) => {
    const password = generator.generate({
        length: req.body.length,
        numbers: req.body.numbers,
        uppercase: req.body.uppercase,
        symbols: req.body.symbols
    })
    res.json(password)
})

//Email generator
router.get('/emailGenerator', (req, res) => {
    getJSON('https://letterb.in/json')
        .then(result => {
            const data = {
                emailTemp: result.email,
                binUrl: result.bin_url,
                inbox: result.bin_url + '/json'
            }
            res.json(data)
        })
        .catch(error => console.log(error))
})


router.get('/registerGenerator', (req, res, next) => {
    const authHeader = req.get('authorization')
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        if (error) {
            console.log(error)
        }
        req.user = user
        console.log(req.user)
        next()
    })
})

//Inbox
router.post('/inbox', (req, res) => {
    const url = req.body.binUrl + "/json"
    getJSON(url)
        .then(response => {
            const n = response.length
            var emails = []
            for (var i = 0; i < n; i++) {
                ilength = response[i].headers[0][1].length
                var email = {
                    from: response[i].headers[0][1].slice(1, ilength - 1),
                    subject: response[i].subject,
                    text: response[i].text,
                    html: response[i].html
                }
                emails.push(email)
            }
            res.json(emails)
        })
        .catch(error => console.log(error))
})

module.exports = router
const express = require('express')
const Joi = require('joi')
const generator = require('generate-password')
var getJSON = require('get-json')
const nodemailer = require('nodemailer')

const router = express.Router()

/*Models*/
const Register = require('../models/register.js')
const User = require('../models/user.js')

//Register validator
const registerSchema = Joi.object().keys({
    registerName: Joi.string().alphanum().min(3).max(12).required(),
    emailGenerated: Joi.string().email().required(),
    binUrl: Joi.string().required(),
    passwordGenerated: Joi.string().required()
})

//Update register validator
const updateRegisterSchema = Joi.object().keys({
    registerName: Joi.string().alphanum().min(3).max(12).required(),
})

//Generate register
router.get('/generateRegister', async (req, res, next) => {
    const data = await getJSON('https://letterb.in/json')
    const password = generator.generate({
        length: 16,
        numbers: true,
        symbols: true,
        uppercase: true,
        exclude: ':;,."|`-+~/()[]{}'
    })
    const newRegister = {
        emailGenerated: data.email,
        binUrl: data.bin_url,
        passwordGenerated: password
    }
    res.json(newRegister)
})

//Get register
router.get('/getRegisters', async (req, res, next) => {
    const register = await Register.find({ user: req.user._id })
    res.json(register)
    console.log(register)
})

//Profile
router.get('/profile', async (req, res) => {
    const user = await User.findOne({ _id: req.user._id })
    res.json(user)
})

//Add register
router.post('/addRegister', async (req, res, next) => {
    const result = Joi.validate(req.body, registerSchema)
    if (result.error === null) {
        const register = await Register.findOne({ registerName: req.body.registerName, user: req.user._id })
        if (register) {
            const error = new Error('Register name already exists.')
            res.status(409)
            next(error)
        } else {
            const newRegister = new Register({
                registerName: req.body.registerName,
                emailGenerated: req.body.emailGenerated,
                binUrl: req.body.binUrl,
                passwordGenerated: req.body.passwordGenerated,
                user: req.user._id
            })
            newRegister.save()
            res.json({ status: 'Register saved.' })
        }
    } else {
        const error = new Error('Invalid register.')
        res.status(422)
        next(error)
    }
})

//Update register
router.put('/updateRegister/:id', async (req, res, next) => {
    const result = Joi.validate(req.body, updateRegisterSchema)
    if (result.error === null) {
        const registerUpdate = await Register.findOne({ registerName: req.body.registerName, user: req.user._id })
        if (!registerUpdate) {
            const register = await Register.findByIdAndUpdate(req.params.id, { registerName: req.body.registerName })
            res.json(register)
        } else {
            const error = new Error('Register name already exists.')
            res.status(409)
            next(error)
        }
    } else {
        const error = new Error('Invalid register name.')
        res.status(422)
        next(error)
    }
})

//Delete register
router.delete('/deleteRegister/:id', async (req, res) => {
    const register = await Register.findByIdAndDelete(req.params.id)
    res.json(register)
})

//Inbox
router.post('/inbox', (req, res) => {
    const url = req.body.binUrl + "/json"
    console.log(url)
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

//Send eemail
router.post('/sendEmail', async (req, res, next) => {
    if (req.user.email) {
        //Transporter
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })
        //Mail options
        var mailOptions = {
            from: 'fromreggentomainmail@gmail.com',
            to: req.user.email,
            subject: req.body.subject,
            text: req.body.text,
            html: req.body.html
        }
        //Send mail
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error', error)
            } else {
                res.json({ message: 'The email with subject "' + req.body.subject + '" has been sent successfully.' })
                console.log('Email sent: ' + info.response)
            }
        })
    } else {
        const error = new Error('You must have a main email to send the emails.')
        res.status(409)
        next(error)
    }
})

module.exports = router
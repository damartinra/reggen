const express = require('express')
const nodemailer = require('nodemailer')

const router = express.Router()

//Model user
const User = require('../models/user.js')

/*
router.get('/', (req, res) => {
    res.json({ message: 'This is the Admin!' })
})
*/

//Get users
router.get('/getUsers', async (req, res, next) => {
    const users = await User.find({ role: 'regular' })
    res.json(users)
})

router.post('/sendWarning', async (req, res, next) => {
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
        to: req.body.email,
        subject: 'Warning about your account',
        text: 'Warning about your account. If you do not login to the application in the next few days, your account will be eliminated in the next days. RegGen Admin.',
        html: '<div style="background: #BBB"><h3>Warning about your account</h3><p>Hi! If you do not login to the application in the next few days, your account will be eliminated in the next days.</p><p>RegGen Admin.</p></div>'
    }
    //Send mail
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            const error = new Error(err)
            res.status(401)
            next(error)
            console.log('Error', err)
        } else {
            res.json({ message: 'The email has been sent successfully.' })
            console.log('Email sent: ' + info.response)
        }
    })
})

//Delete user
router.delete('/deleteUser/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id)
    res.json(user)
})

module.exports = router
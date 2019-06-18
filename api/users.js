const express = require('express')
const bcrypt = require('bcrypt')
const Joi = require('joi')

const router = express.Router()

//User model
const User = require('../models/user.js')

//Password validator
const passwordSchema = Joi.object().keys({
    currentPassword: Joi.string().regex(/(^(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))/).min(8).required(),
    newPassword: Joi.string().regex(/(^(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))/).min(8).required(),
    confirmPassword: Joi.string().regex(/(^(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))/).min(8).required()
})

//Account validator
const editSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().empty().optional()
})

//Profile
router.get('/profile', async (req, res) => {
    const user = await User.findOne({ _id: req.user._id })
    res.json(user)
})

//Edit account
router.put('/editAccount', (req, res, next) => {
    const result = Joi.validate(req.body, editSchema)
    if (result.error === null) {
        if (req.body.username == req.user.username && req.body.email == req.user.email) {
            const error = new Error('The username and email are the same.')
            res.status(409)
            next(error)
        } else {
            User.findOne({ username: req.body.username }).then(user => {
                if (user && req.body.username != req.user.username) {
                    //si el nombre de usuario existe
                    const error = new Error('Username already exists.')
                    res.status(409)
                    next(error)
                } else {
                    User.findOne({ email: req.body.email }).then(user => {
                        if (user && req.body.email != req.user.email) {
                            //si el email de usuario existe
                            const error = new Error('Email already exists.')
                            res.status(409)
                            next(error)
                        } else {
                            User.findOne({ _id: req.user._id })
                                .then(user => {
                                    user.username = req.body.username
                                    user.email = req.body.email
                                    user.save()
                                        .then(result => { res.json({ message: 'Account changed.' }) })
                                })
                        }
                    })
                }
            })
        }
    } else {
        const error = new Error('Invalid username or email.')
        res.status(422)
        next(error)
    }
})

//Edit password
router.put('/editPassword', async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id })
    bcrypt.compare(req.body.currentPassword, user.password).then(result => {
        if (result) {
            const result = Joi.validate(req.body, passwordSchema)
            if (result.error === null) {
                if (req.body.currentPassword === req.body.newPassword) {
                    const error = new Error('The password is the same.')
                    res.status(401)
                    next(error)
                } else {
                    if (req.body.newPassword == req.body.confirmPassword) {
                        bcrypt.hash(req.body.newPassword, 10).then(hashedPass => {
                            //update
                            User.findOne({ _id: req.user._id })
                                .then(user => {
                                    user.password = hashedPass
                                    user.save()
                                        .then(result => { res.json({ message: 'Password changed.' }) })
                                })
                        })
                    } else {
                        const error = new Error('Passwords do not match.')
                        res.status(401)
                        next(error)
                    }
                }
            } else {
                const error = new Error('Invalid password.')
                res.status(401)
                next(error)
            }
        } else {
            const error = new Error('Incorrect password.')
            res.status(401)
            next(error)
        }
    })
})

//Delete account
router.delete('/deleteAccount', async (req, res) => {
    const user = await User.findByIdAndDelete(req.user._id)
    res.json(user)
})

module.exports = router
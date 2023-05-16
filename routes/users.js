const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../config/database')

const router = express.Router()

router.post('/register', (req, res, next) => {
    // console.log(req.body)

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    })
    
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json(err)
        } else {
            res.json({user: {
                username: user.username,
                email: user.email
            }})
        }
    })
})

router.post('/authenticate', (req, res, next) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ username: username })
    .then(user => {
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err

            if (isMatch) {
                const token = jwt.sign(Object.assign({}, user), config.secret, {
                    expiresIn: 604800,
                })

                res.json({
                    success: true,
                    token: "Bearer " + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username,
                    }
                })
            }
        })
    })
    .catch(error => res.status(500).send(error))
})

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user })
})

router.put('/update/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const userId = req.params.id
    User.getUserByID(userId, (user, error) => {
        if (error) {
            return done(error, false)
        }
        if (user) {
            const updatedInfo = {
                address: req.body.address,
                contactNumber : req.body.contactNumber
            }
            User.updateUserInfo(user, updatedInfo)
            res.json({ message: 'Success'})
        } else {
            return done(null, false)
        }
    })
    console.log(req.user)
})

router.get('/user', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({ user: {
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    address: req.user.address,
    contactNumber: req.user.contactNumber,
  }})
})

module.exports = router
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../models/user')
const config = require('../config/database')
const passport = require('passport')

module.exports = () => {
    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secret
    }
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        console.log("payload: ", jwt_payload)
        User.getUserByID(jwt_payload._doc._id, (user, err) => {
            if (err) {
                return done(err, false)
            }
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
    }))
}
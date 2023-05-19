const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('../config/database')

const UserSchema = mongoose.Schema({
  email: {
      type: String,
      required: true,
  },
  username: {
      type: String,
      required: true,
  },
  age: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  password: {
      type: String,
      required: true,
  },
  address: {
    type: String,
    required: false,
  },
  contactNumber: {
    type: Number,
    required: false,
  }
})

const User = module.exports = mongoose.model('User', UserSchema)

module.exports.getUserByID = async (_id, callback) => {
  try {
    const user = await User.findById(_id)
    if (user) {
      callback(user, undefined)
    }
  } catch (error) {
    callback(undefined, error)
    throw error
  }
}

// module.exports.getUserByUserName = async (username) => {
//   const query = { username: username }
//   const user = User.findOne(query)
// }

module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        throw err
      }
      newUser.password = hash
      newUser.save().then(() => callback(null, newUser)).catch(() => callback(err, null))
    })
  })
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err
    callback(null, isMatch)
  })
}

module.exports.updateUserInfo = async (user, updatedInfo) => {
  try {
      let doc = await User.findOneAndUpdate({
        // _id: user._id,
        username: user.username,
        age: updatedInfo.age,
        gender: updatedInfo.gender,
        email: user.email,
        address: updatedInfo.address,
        contactNumber: updatedInfo.contactNumber,
    })
    doc = await User.findOne(user)
  } catch (err) {
    throw err
  }
}
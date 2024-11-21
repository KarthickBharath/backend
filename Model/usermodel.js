const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    uname: String,
    email: String,
    password: String
    }
)

const userModel = mongoose.model('register',UserSchema)

module.exports = userModel
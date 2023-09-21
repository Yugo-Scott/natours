const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'], //validator
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'], //validator
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'], //validator
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password!'], //validator
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'], //validator
  },

});

const User = mongoose.model('User', userSchema);

module.exports = User;
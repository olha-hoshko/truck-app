const mongoose = require('mongoose');

const userRoles = ['SHIPPER', 'DRIVER'];

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: userRoles,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = { User, userRoles };

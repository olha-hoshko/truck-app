/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

require('dotenv').config();

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User } = require('../models/User');

const registerUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please, enter an email' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Please, enter a password' });
    }
    if (!role) {
      return res.status(400).json({ message: 'Please, choose a role' });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'This email is already in use' });
    }
    const user = new User({ email, password: await bcryptjs.hash(password, 10), role });
    return user.save()
      .then(() => res.json({ message: 'Profile created successfully' }))
      .catch((err) => { next(err); });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please, enter an email' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Please, enter a password' });
    }
    const user = await User.findOne({ email });
    if (user && await bcryptjs.compare(String(password), String(user.password))) {
      const payload = { email: user.email, userId: user._id, role: user.role };
      const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);
      return res.json({
        jwt_token: jwtToken,
      });
    }
    return res.status(400).json({ message: 'Wrong login data' });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const sendMail = async (userEmail, randomPassword) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Forgot Password",
    html: `<p>Hi, ${userEmail}</p> <br/>
      <pre>Your new password to truckapp is ${randomPassword}</pre><br/>`
  }

  return new Promise((resolve) => {
    nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      },
      port: 465,
      host: 'smtp.gmail.com'
    }).sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(false);
      }
      else {
        resolve(true);
      }
    });
  });
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ message: 'Please, enter your email' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Account with this email has not been created yet' });
    }
    const randomPassword = Math.random().toString(36).slice(-8);
    const mailInfo = await sendMail(email, randomPassword);
    if (mailInfo) {
      user.password = await bcryptjs.hash(randomPassword, 10);
      await user.save()
        .then(() => res.json({ message: 'New password was send to your email' }))
        .catch((err) => { next(err); });
    }
    return res.status(400).json({ message: 'Can not send a new password to entered email' });

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
};

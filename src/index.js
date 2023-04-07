require('dotenv').config();

const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const { authRouter } = require('./routes/authRouter');
const { usersRouter } = require('./routes/usersRouter');
const { trucksRouter } = require('./routes/trucksRouter');
const { loadsRouter } = require('./routes/loadsRouter');

app.use(cors());
app.use(express.json());
const accessLogStream = fs.createWriteStream('./logs.log', { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('tiny'));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/trucks', trucksRouter);
app.use('/api/loads', loadsRouter);

const start = async () => {
  try {
    app.listen(8080);
  } catch (err) {
    console.error(`Error on server startup: ${err.message}`);
  }
};

start();

// ERROR HANDLER
function errorHandler(err, req, res, next) {
  res.status(500).send({ message: err.message });
}

app.use(errorHandler);

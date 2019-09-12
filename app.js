const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { MONGODB_URI } = require('./mongoConfig');

const indexRouter = require('./routes/index');
const pairsRouter = require('./routes/pairs');
const ratesRouter = require('./routes/rates');

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/foreign", { useNewUrlParser: true, useCreateIndex: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('connected to db')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/pairs', pairsRouter);
app.use('/rates', ratesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
}, err => {
  if (err) {
    return console.log(err);
  }
  if (process.env.ENVIRONMENT === 'PRODUCTION' || process.env.ENVIRONMENT === 'DEVELOPMENT') {
    console.log('MongoDB Connected');
  }
});

module.exports = app;

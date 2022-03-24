require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');


const regAdmin = require('./modules/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//
var cors = require('cors');    
app.use(cors({
    origin: ['https://dev.unicreate.ru:3005', 'https://dev.unicreate.ru:3007', 'https://dev.unicreate.ru:3000', 'https://dev.unicreate.ru:3003'],
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    credentials: true,
    optionSuccessStatus:200
}));


let indexPlayers = require('./routes/players/index');
indexPlayers(app);
let indexPlayersPrivate = require('./routes/players/private/index');
indexPlayersPrivate(app);
let indexPromocodes = require('./routes/promocodes/index');
indexPromocodes(app);
let indexFranchisee = require('./routes/franchisee/index');
indexFranchisee(app);
let indexUsers = require('./routes/users/index');
indexUsers(app);
let indexRouterPayments = require('./routes/payments/index');
indexRouterPayments(app);
let indexRouterStats = require('./routes/statistic/index');
indexRouterStats(app);

require('./routes/games/main.js');


// connecting mongoDB
const uri = 'mongodb://mongo:27017/realloto';
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

console.log("process.env.DEV", process.env.DEV);
console.log("process.env.PORT", process.env.PORT);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log("good");



module.exports = app;

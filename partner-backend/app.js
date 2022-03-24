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

var cors = require('cors');
app.use(cors({
    origin: ['https://dev.unicreate.ru:3005', 'https://dev.unicreate.ru:3007'],
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    credentials: true,
    optionSuccessStatus:200
}));


let indexUsers = require('./routes/users/index');
indexUsers(app);
let indexFilials = require('./routes/filials/index');
indexFilials(app);
let indexManagers = require('./routes/managers/index');
indexManagers(app);
let indexOperators = require('./routes/operators/index');
indexOperators(app);
let playersOffline = require('./routes/players-offline/index');
playersOffline(app);



// connecting mongoDB
const uri = 'mongodb://mongo:27017/realloto';
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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

regAdmin("admin", "admin123")

module.exports = app;

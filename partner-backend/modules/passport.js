const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const Players = require('../models/Players.js');
const Admins = require('../models/Admins.js');
const crypto = require('crypto');
//const SMSru = require('sms_ru');
//let sms = new SMSru('F728B532-A357-78A6-7C7A-EC5B8D25FD41');
console.log("passport run!")

function validPassword(password, hash, salt) {
  let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

function randomString(i) {
  let rnd = '';
  while (rnd.length < i) rnd += Math.random().toString(9).substring(2);
  return rnd.substring(0, i);
};

passport.use('login-phone', new LocalStrategy({usernameField: 'phone', passwordField: 'password'}, async (phone, password, done) => {
  console.log("login-phone");
  let user = await Players.findOne({phone: phone});
  if (!user) return done(null, false, { code: 0, message: 'Incorrect phone.' });
  if (!user.phoneConfirm) return done(null, false, { code: 3, message: 'no code' });
  let hashVerify = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('hex');
  if (hashVerify === user.password) return done(null, user, { code: 55, message: 'okkkk' });
  return done(null, false, { code: 1, message: 'Incorrect password.' });
}));

passport.use('login-mail', new LocalStrategy({usernameField: 'mail', passwordField: 'password'}, async (mail, password, done) => {
  let user = await Players.findOne({mail: mail})
  if (!user) return done(null, false, { code: 0, message: 'Incorrect mail.' });
  if (!user.phoneConfirm) return done(null, false, { code: 3, message: 'no code' });
  let hashVerify = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('hex');
  if (hashVerify === user.password) return done(null, user, { code: 55, message: 'okkkk' });
  return done(null, false, { code: 1, message: 'Incorrect password.' });
}));


passport.use('login-admin', new LocalStrategy({usernameField: 'login', passwordField: 'password'},async (login, password, done) => {
  let user = await Admins.findOne({login: login});
  console.log("user---", user);
  if (!user) return done(null, false, { message: 'Incorrect username.' });
  let hashVerify = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('hex');
  if (hashVerify === user.password) return done(null, user, { message: 'okkkk' });
  return done(null, false, { message: 'Incorrect password.' });
}));

passport.use('registration-phone', new LocalStrategy({usernameField : 'phone',passwordField : 'password'}, async (phone, password, done) => {
  let user = await Players.findOne({phone: phone})
  if (user) return done(null, false, { message: 'That phone is already taken.' });

  let code = randomString(6);
  let number = phone.slice(1);
  /*sms.sms_send({to: number, text: 'Код подтверждения: ' + code}, (e) => {
    console.log(e.description);
  });*/
  console.log('Код подтверждения: ' + code);

  let salt = crypto.randomBytes(32).toString('hex');
  let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  let newUser = await new Players({phone: phone, password: hash, salt: salt, code: code, phoneConfirm: false, status: 'noblocked', balance: 0, passportStatus: 'no',}).save();
  return done(null, newUser);

}));

passport.use('registration-mail', new LocalStrategy({usernameField : 'mail', passwordField : 'password'}, async (mail, password, done) => {
  let user = await Players.findOne({mail: mail})
  if (user) {
    return done(null, false, { message: 'That mail is already taken.' });
  }

  let code = randomString(6);
  /*отпрвить mail с кодом*/
  console.log('Код подтверждения: ' + code);

  let salt = crypto.randomBytes(32).toString('hex');
  let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  let newUser = await new Players({mail: mail, password: hash, salt: salt, code: code, phoneConfirm: false, status: 'noblocked', balance: 0, passportStatus: 'no'}).save();
  return done(null, newUser);
}));



passport.use('registration-admin', new LocalStrategy({usernameField : 'login', passwordField : 'password'}, async (login, password, done) => {
  /*User.UserModel.findOne({ 'login' :  login }, function(err, user) {
    if (err)
      return done(err);
    if (user) {
      return done(null, false, { message: 'That login is already taken.' });
    }

    let salt = crypto.randomBytes(32).toString('hex');
    let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    let newAdmin = new Admin.AdminModel({login: login, password: hash, salt: salt, level: 0});
    newAdmin.save(function (err) {
      if (err) return handleError(err);
    })
    return done(null, newAdmin);
  })*/
}));


passport.use('reset-phone', new LocalStrategy({usernameField : 'phone', passwordField : 'phone'}, async (phone, password, done) => {
  let user = await Players.findOne({phone: phone});
  if (!user) return done(null, false, {code: 0, message: "incorrect phone"});
  let code = randomString(6);
  let number = phone.slice(1);
  console.log('Код подтверждения: ' + code);
  /*sms.sms_send({to: number, text: 'Код подтверждения: ' + code}, (e) => {
    console.log(e.description);
  });*/
  await Players.updateOne({phone: user.phone}, {$set: {code: code}}, {upsert: false});
  return done(null, true);
}));

passport.use('reset-mail', new LocalStrategy({usernameField : 'mail', passwordField : 'mail'}, async (mail, password, done) => {
  let user = await Players.findOne({mail: mail});
  if (!user) return done(null, false, {code: 0, message: "incorrect mail"});
  let code = randomString(6);
  let number = mail.slice(1);
  console.log('Код подтверждения: ' + code);
  /*отправить email с кодом*/
  await Players.updateOne({mail: user.mail}, {$set: {code: code}}, {upsert: false});
  return done(null, true);
}));

module.exports = passport;
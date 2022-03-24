const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const Players = require('../models/Players.js');
const Admins = require('../models/Admins.js');

const SMSLogs = require('../models/SMSLogs.js');

const sendEmail = require('./mail.js');

const crypto = require('crypto');

const SMSru = require('sms_ru');
let sms = new SMSru('F728B532-A357-78A6-7C7A-EC5B8D25FD41');

console.log("passport run!");

let SMSRequere = () => {
  sms.my_balance((e) => {
    if (e.code === "100") SMSLogs({type: "success", text: "СМС сервис работает. Баланс: " + e.balance}).save();
    else SMSLogs({type: "error", text: "СМС сервис не отвечает"}).save();
  })
}

function validPassword(password, hash, salt) {
  let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

function randomString(i) {
  let rnd = '';
  while (rnd.length < i) rnd += Math.random().toString(9).substring(2);
  return rnd.substring(0, i);
};

passport.use('login', new LocalStrategy({usernameField: 'login', passwordField: 'password'}, async (login, password, done) => {
  console.log("login-login");
  let user = await Players.findOne({login: login});
  if (!user) return done(null, false, { code: 0, message: 'Incorrect login.' });
  if (!user.phoneConfirm) {
    await Players.deleteOne({login: login});
    return done(null, false, { code: 3, message: 'no code' });
  }
  let hashVerify = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('hex');
  if (hashVerify === user.password) return done(null, user, { code: 55, message: 'okkkk' });
  return done(null, false, { code: 1, message: 'Incorrect password.' });
}));

passport.use('login-code', new LocalStrategy({usernameField: 'code', passwordField: 'code'}, async (login, password, done) => {
  console.log("login-code", login);
  let user = await Players.findOne({password: login, active: true});
  console.log("user", user)
  if (!user) return done(null, false, { code: 0, message: 'Incorrect code.' });
  if (!user.active) return done(null, false, { code: 0, message: 'Вы не активировали аккаунт, обратитесь к администратору' });
  return done(null, user, { code: 55, message: 'okkkk' });
}));


passport.use('login-admin', new LocalStrategy({usernameField: 'login', passwordField: 'password'},async (login, password, done) => {
  let user = await Admins.findOne({login: login, level: 0});
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
  SMSRequere();
  sms.sms_send({to: number, text: 'Код подтверждения: ' + code, from: "unicreate"}, (e) => console.log(e.description));
  console.log('Код подтверждения: ' + code);

  let salt = crypto.randomBytes(32).toString('hex');
  let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  let players = await Players.find();
  let idUser = players.length ? players[players.length-1].idUser + 1 : 1;

  let newUser = await new Players({idUser: idUser, login: phone, phone: phone, password: hash, salt: salt, code: code, phoneConfirm: false, status: 'noblocked', balance: 0, passportStatus: 'no',}).save();
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
  sendEmail(mail, "Код подтверждения", 'Код подтверждения: ' + code + '<br> Исспользуйте этот код для регистрации.');

  let salt = crypto.randomBytes(32).toString('hex');
  let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  let players = await Players.find();
  let idUser = players.length ? players[players.length-1].idUser + 1 : 1;

  let newUser = await new Players({idUser: idUser, login: mail, mail: mail, password: hash, salt: salt, code: code, phoneConfirm: false, status: 'noblocked', balance: 0, passportStatus: 'no'}).save();
  return done(null, newUser);
}));

passport.use('reset', new LocalStrategy({usernameField : 'login', passwordField : 'login'}, async (login, password, done) => {
  let user = await Players.findOne({login: login});
  if (!user) return done(null, false, {code: 0, message: "incorrect login"});
  let code = randomString(6);
  if (user.phone) {
    let number = user.phone.slice(1);
    console.log('Код подтверждения: ' + code);
    SMSRequere();
    sms.sms_send({to: number, text: 'Код подтверждения: ' + code, from: "unicreate"}, (e) => {
      console.log(e.description);
    });
  }
  if (user.mail) {
    console.log('Код подтверждения: ' + code);
    sendEmail(user.mail, "Код подтверждения", 'Код подтверждения: ' + code + '<br> Исспользуйте этот код для сброса пароля.');
  }
  await Players.updateOne({login: login}, {$set: {code: code}}, {upsert: false});
  return done(null, user);
}));

module.exports = passport;
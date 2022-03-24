const crypto = require('crypto');
const Admins = require('../models/Admins.js');

module.exports = async (login, password) => {
	let admin = await Admins.findOne({level: 0});
	if (admin) return;
	let admins = Admins.find();
	let idUser = (admins.length && admins[admins.length-1].idAdmin) ? admins[admins.length-1].idAdmin + 1 : 1;
	let salt = crypto.randomBytes(32).toString('hex');
	let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
	let newFranchisee = await new Admins({idAdmin: idUser, fio: "admin", login: login, password: hash, salt: salt, level: 0}).save();
	return true;
}
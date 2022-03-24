const crypto = require('crypto');
const Admins = require('../models/Admins.js');

module.exports = async (login, password) => {
	let admin = await Admins.findOne({level: 0});
	if (admin) return;
	let salt = crypto.randomBytes(32).toString('hex');
	let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
	let newFranchisee = await new Admins({fio: "admin", login: login, password: hash, salt: salt, level: 0}).save();
	return true;
}
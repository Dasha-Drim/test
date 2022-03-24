const Players = require('../../../models/Players.js');

module.exports = async (idUser) => {
	await Players.updateOne({idUser: idUser}, {$set: {password: null, active: false}}, {upsert: false});
	return {success: true};
}
const Players = require('../../../models/Players.js');

function randomString(i) {
	let rnd = '';
	while (rnd.length < i) rnd += Math.random().toString(9).substring(2);
	return rnd.substring(0, i);
};

module.exports = async (idUser, currency, filial) => {
	let password = randomString(6);

	let player = await Players.findOne({idUser: idUser});
	await Players.updateOne({idUser: idUser}, {$set: {password: password, active: true, currency: currency, idFilial: filial}}, {upsert: false});

	return {success: true, code: password};
}
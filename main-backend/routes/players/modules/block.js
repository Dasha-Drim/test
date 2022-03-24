const Players = require('../../../models/Players.js');

module.exports = async (id, status) => {
	await Players.updateOne({'idUser': id}, {$set: {status: status}}, {upsert: false});
	return {success: true, status: status};
}
const Admins = require('../../../models/Admins.js');
const Filials = require('../../../models/Filials.js');

module.exports = async (idFilial, idManager) => {
	let arrFilials = [];
	await Filials.updateOne({idFilial: idFilial}, {$addToSet: {managers: idManager}}, {upsert: false});
	let manager = await Admins.findOne({idAdmin: idManager});
	arrFilials = manager.filials
	arrFilials.push(idFilial);
	await Admins.updateOne({idAdmin: idManager}, {$set: {numberOfFilials: manager.numberOfFilials + 1, filials: arrFilials}}, {upsert: false});
	return {success: true};
}
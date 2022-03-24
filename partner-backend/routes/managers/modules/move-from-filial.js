const Admins = require('../../../models/Admins.js');
const Filials = require('../../../models/Filials.js');

module.exports = async (idFilial, idManager) => {
	let arrManagers = [];
	let arrFilials = [];
	let filial = await Filials.findOne({idFilial: idFilial});
	for (item of filial.managers) {
		if (item !== idManager) arrManagers.push(item);
	}
	await Filials.updateOne({idFilial: idFilial}, {$set: {managers: arrManagers}}, {upsert: false});
	let manager = await Admins.findOne({idAdmin: idManager});
	for (item of manager.filials) {
		if (item !== idFilial) arrFilials.push(item);
	}
	await Admins.updateOne({idAdmin: idManager}, {$set: {numberOfFilials: manager.numberOfFilials - 1, filials: arrFilials}}, {upsert: false});
	return {success: true};
}
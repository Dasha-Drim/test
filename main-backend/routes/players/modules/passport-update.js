const Players = require('../../../models/Players.js');

module.exports = async (id, data) => {
 	if (!data.number || !data.name || !data.surname || !data.dateBirth) return {success: false, message: "Недостаточно данных"};
	await Players.updateOne({idUser: id}, {$set: {passportStatus: 'notconfirmed', passport: {number: data.number, dateBirth: data.dateBirth, name: data.name, surname: data.surname, patronymic: data.patronymic}}}, {upsert: false});
 	return {success: true};
}

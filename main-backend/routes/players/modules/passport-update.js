const Players = require('../../../models/Players.js');

module.exports = async (id, data) => {
 	if (!data.number || !data.name || !data.surname || !data.dateBirth) return {success: false, message: "Недостаточно данных"};
 	let arrDate = data.dateBirth.split(".");
	let dateBirth = arrDate[2] + "-" + arrDate[1] + "-" + arrDate[0];
	await Players.updateOne({idUser: id}, {$set: {passportStatus: 'notconfirmed', passport: {number: data.number, dateBirth: dateBirth, name: data.name, surname: data.surname, patronymic: data.patronymic}}}, {upsert: false});
 	return {success: true};
}

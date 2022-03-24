const Players = require('../../../models/Players.js');

module.exports = async (idUser, data, photo) => {
 	if (!data.number || !data.firstName || !data.lastName || !data.birthday || !photo) return {success: false, message: "Недостаточно данных"};
	await Players.updateOne({idUser: idUser}, {$set: {passportStatus: 'confirmed', passport: {photo: "/uploads/" + photo, number: data.number, dateBirth: data.birthday, name: data.firstName, surname: data.lastName, patronymic: data.middleName}}}, {upsert: false});
 	return {success: true};
}
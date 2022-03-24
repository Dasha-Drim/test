const { DateTime } = require("luxon");
const axios = require('axios');

const Promocodes = require('../../../models/Promocodes.js');
const Players = require('../../../models/Players.js');
const PaymentsLog = require('../../../models/PaymentsLog.js');

module.exports = async (id, promocode) => {
	let user = await Players.findOne({'idUser': id});
	if (user.status == 'blocked') return {success: false, message: 'User blocked'};
	if ((user.promocodes) && (user.promocodes.indexOf(promocode) !== -1)) return {success: false, message: "Вы уже использовали данный промокод"};
	let promocodeInfo = await Promocodes.findOne({promocode: promocode});
	if (!promocodeInfo) return {success: false, message: "Такого промокода не существует"};
	if (promocodeInfo.dateEnd && (DateTime.local() > DateTime.fromISO(promocodeInfo.dateEnd))) return {success: false, message: "Время действия промокода истекло"};
	
	let response = await axios({
        method: "get",
        url: 'https://www.cbr-xml-daily.ru/latest.js',
    });

	let bonus = (+user.bonus || 0) + Math.round(+promocodeInfo.price / response.data.rates.USD * response.data.rates[user.currency]);
	let countOperation = await PaymentsLog.count();
	await new PaymentsLog({method: "bonus", operationId: +countOperation+1, amount: +promocodeInfo.price, type: "up", dateTime: DateTime.local().setZone("Europe/Moscow").toISO(), userId: user._id}).save();
	let arrPromocodes = user.promocodes ? user.promocodes : [];
	arrPromocodes.push(promocode);
	await Players.updateOne({'idUser': user.idUser}, {$set: {bonus: bonus, promocodes: arrPromocodes}}, {upsert: false});
	await Promocodes.updateOne({promocode: promocode}, {$set: {count: (+promocodeInfo.count || 0) + 1}}, {upsert: false});
	return {success: true};
}
let verifyDataPassport = function(data) {
	let OnlyLetters = /^[a-zA-Zа-яёА-ЯЁ]+$/;
	let OnlyData = /^[0-9]{2}[.]{1}[0-9]{2}[.]{1}[0-9]{4}$/;
	let OnlyNum = /^[0-9]+$/;

	if (!data.passportName.match(OnlyLetters)) return 'в имени могут быть только буквы';
	if (!data.passportLastName.match(OnlyLetters)) return 'в фамилии могут быть только буквы';
	if (!data.passportMiddleName.match(OnlyLetters)) return 'в отчестве могут быть только буквы';
	if (!data.passportDOB.match(OnlyData)) return 'неправильная дата';
	if (!data.passportSex.match(OnlyLetters)) return 'только буквы';
	if (!data.passportDateIssued.match(OnlyData)) return 'неправильная дата';

	return false
}

let verifyAmount = function(amount) {
	let OnlyNum = /^[0-9]+$/;
	if (!amount.match(OnlyNum)) return 'В сумме пополнения или снятия могут быть только цифры';
	return false
}

let verifyPromocode = function(data) {
	let OnlyLettersAndNum = /^[a-zA-Zа-яёА-ЯЁ0-9]+$/;
	let OnlyNum = /^[0-9]+$/;

	if (!data.promocode.match(OnlyLettersAndNum)) return 'В названии промокода могут быть только буквы и цифры';
	if (!data.price.match(OnlyNum)) return 'В сумме бонуса могут быть только цифры';
	return false
}

module.exports.verifyDataPassport = verifyDataPassport;
module.exports.verifyAmount = verifyAmount;
module.exports.verifyPromocode = verifyPromocode;
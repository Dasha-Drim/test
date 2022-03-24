const express = require('express');
const router = express.Router();
const jwt = require('../../modules/jwt.js');
const multer = require('multer');

const Admins = require('../../models/Admins.js');
const Players = require('../../models/Players.js');

let activate = require('./modules/activate');
let deactivate = require('./modules/deactivate');
let passport = require('./modules/passport');
let balanceAdd = require('./modules/balance-add');
let balanceWithdraw = require('./modules/balance-withdraw');

let upload = multer({ dest: 'uploads/' });
let storageConfig = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "./uploads"),
	filename: (req, file, cb) => {
		let extArray = file.originalname.split(".");
		let extension = extArray[extArray.length - 1];
		cb(null, Date.now()+ '.' +extension)
	}
});
let fileFilter = (req, file, cb) => {
	if(file.mimetype === "image/png" || file.mimetype === "image/jpg"|| file.mimetype === "image/jpeg") cb(null, true);
	else return cb(new Error('WRONG_MIME_TYPE'), false);
}
let uploadLimits = {fileSize: 6 * 1024 * 1024} // 6 MB (max file size)
let cpUpload = multer({dest: './uploads', storage:storageConfig, limits: uploadLimits, fileFilter: fileFilter});

router.put('/players-offline', cpUpload.single('passportPhoto'), function (err, req, res, next) {
    if (err.message === 'WRONG_MIME_TYPE') return res.send({ success: false, message: 'Файл неправильного формата. Доступные форматы для загрузки: PNG, JPG, JPEG.' })
    if (err.code === 'LIMIT_FILE_SIZE') return res.send({ success: false, message: 'Файл слишком большой. Максимальный размер файла: 6 МБ' })
    next();
})

router.put('/players-offline', async (req, res) => {
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if ((!token || (token.role !== 'operator'))) return res.send({success: false, message: 'Incorrect token'});

	if(!req.body.idUser) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены (idUser)'});
	if(!req.body.action) return res.send({success: false, message: 'Не все данные, необходимые для данной операции, были отправлены (action)'});

	let player = await Players.findOne({idUser: req.body.idUser, inFilial: true});
	if (!player) return res.send({success: false, message: "Такого пользователя нет"});

	if (req.body.action === "activate") {
		let admin = await Admins.findOne({idAdmin: token.id})
		let result = await activate(req.body.idUser, admin.currency, admin.filials[0]);
		return res.send(result);
	}

	if (req.body.action === "deactivate") {
		let result = await deactivate(req.body.idUser);
		return res.send(result);
	}

	if (req.body.action === "passport") {
		let result = await passport(req.body.idUser, req.body, req.file.filename);
		return res.send(result);
	}

	if (req.body.action === "deposit") {
		let admin = await Admins.findOne({idAdmin: token.id})
		let result = await balanceAdd(req.body.idUser, req.body.amount, token.id);
		return res.send(result);
	}

	if (req.body.action === "withdraw") {
		let admin = await Admins.findOne({idAdmin: token.id})
		let result = await balanceWithdraw(req.body.idUser, req.body.amount, token.id);
		return res.send(result);
	}
	
});

module.exports = router;
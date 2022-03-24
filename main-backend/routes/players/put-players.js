const express = require('express');
const router = express.Router();

const jwt = require('../../modules/jwt');
const multer  = require('multer');

const block = require('./modules/block');
const passportAdd = require('./modules/passport-add');
const passportUpdate = require('./modules/passport-update');
const passportConfirm = require('./modules/passport-confirm');
const promocode = require('./modules/promocode');
const withdraw = require('./modules/withdraw');
const deposit = require('./modules/deposit');

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

router.put('/players', cpUpload.single('passportPhoto'), function (err, req, res, next) {
    if (err.message === 'WRONG_MIME_TYPE') return res.send({ success: false, message: 'Файл неправильного формата. Доступные форматы для загрузки: PNG, JPG, JPEG.' })
    if (err.code === 'LIMIT_FILE_SIZE') return res.send({ success: false, message: 'Файл слишком большой. Максимальный размер файла: 6 МБ' })
    next();
})

router.put('/players', async (req, res) => {
	console.log("put-players");
	console.log("put-players", req.body);
	console.log("put-players",  req.file);
	let token = jwt.updateJWT(req.cookies.token, res, req.headers["user-agent"]);
	if (!token) return res.send({success: false, message: 'Incorrect token'});
	let result;
	if (req.body.action == 'block') {
		if (token.role !== "admin") return res.send({success: false, message: 'Incorrect token'});
		result = await block(req.body.idUser, req.body.accountStatus);
		return res.send(result);
	}
	if (req.body.action == 'promocode') {
		if (token.role !== "user") return res.send({success: false, message: 'Incorrect token'});
		result = await promocode(token.id, req.body.promocode);
		return res.send(result);
	}
	if (req.body.action == 'passport-update') {
		if (token.role !== "user") return res.send({success: false, message: 'Incorrect token'});
		result = await passportUpdate(token.id, req.body);
		return res.send(result);
	}
	if (req.body.action == 'passport-confirm') {
		if (token.role !== "admin") return res.send({success: false, message: 'Incorrect token'});
		result = await passportConfirm(req.body.idUser, req.body, req.file.filename);
		return res.send(result);
	}
	if (req.body.action == 'withdraw') {
		if (token.role !== "admin") return res.send({success: false, message: 'Incorrect token'});
		result = await withdraw(req.body.idUser, req.body.amount);
		return res.send(result);
	}
	if (req.body.action == 'deposit') {
		if (token.role !== "admin") return res.send({success: false, message: 'Incorrect token'});
		result = await deposit(req.body.idUser, req.body.amount);
		return res.send(result);
	}
});

module.exports = router;
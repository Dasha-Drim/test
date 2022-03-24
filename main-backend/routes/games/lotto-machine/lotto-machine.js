let config = require('../../../config/config.js');
const { Telnet } = require('telnet-client');
const LottoLog = require('../../../models/LottoLog.js');
const mail = require('../../../modules/mail.js');



class LottoMachine {
	isConnected;
	isResponds;
	connection;
	isSendEmail = false;
	params = {
		host: config.config.lottoMachineIP1,
		port: config.config.lottoMachinePort1,
		negotiationMandatory: false,
		echoLines: 2,
	}

	constructor() {
		console.log("process.env.DEV !== true", process.env.DEV !== "true")
		if (process.env.DEV !== "true") this.runTelenetConnect();
	}

	
	async runTelenetConnect() {
	  	let connection = new Telnet();
	  	try {
	  		await connection.connect(this.params);
	  		this.connection = connection;
	  		let status = await this.checkConnection();
	  		if (!status) return this.isConnected = false;
	  		this.isConnected = true;
	  		if (status) await LottoLog({type: "success", text: "Лотто-машина работает исправно"}).save();
	  		console.log("connect");
	  	} catch(error) {
	  		console.log("no connect", error);
	  		this.isConnected = false;
	  		this.connection = null;
	  		await LottoLog({type: "error", text: "Нет подключения к лотто-машине"}).save();
	  	}
	}

	async checkConnection() {
		try {
			let res = await this.connection.send("showstate" + '\r\n');
			console.log("res", res)
			if (res) {
				if ((this.isResponds === false) && (this.isSendEmail)) {
					this.errorLottoMachine(true);
					await LottoLog({type: "success", text: "Лотто-машина работает исправно"}).save();
				}
				this.isSendEmail = false;
				this.isResponds = true;
				return true;
			}
		} catch(err) {
			if ((this.isResponds === true) && (!this.isSendEmail)) {
				this.errorLottoMachine(false);
				await LottoLog({type: "error", text: "Лотто-машина не отвечает на команды"}).save();
				this.isSendEmail = true;
			}

			this.isResponds = false;
			return false;
		}
		return false;
	}

	async errorLottoMachine(status) {
		if (!status) mail('daria@unicreate.ru', "Ошибка!", "Ошибка с лотто-машиной, провербте подключение к сети");
		else mail('daria@unicreate.ru', "Машина работает!", "Лотто-машина заработала");
		console.log("ошибка лотто машина");
		return;
	}

	async sendCommand(command) {
	  	if (!this.isConnected) return this.runTelenetConnect();
	  	let status = await this.checkConnection();
	  	if (!status) {
	  		if (this.connection) await this.connection.destroy();
			this.runTelenetConnect();
			return false;
	  	}
	  	try {
	  		let res = await this.connection.send(command + '\r\n');
	  		console.log("res", res)
	  		if (res) {
	  			let arrayResults = res.split('\n');
	  			let result = eval('(' + arrayResults[0] + ')');
	  			return result;
	  		} else {
	  			this.runTelenetConnect();
	  			return false;
	  		}
	  	} catch(err) {
	  		this.runTelenetConnect();
	  		return false;
	  	}
	  	return false;
	}

	async sendCommandStartDraw() {
	  	if (!this.isConnected) return this.runTelenetConnect();
	  	let status = await this.checkConnection();
	  	if (!status) {
	  		if (this.connection) await this.connection.destroy();
			this.runTelenetConnect();
			return false;
	  	}
	  	try {
	  		let res = await this.connection.send('startdraw\r\n', {waitfor: /ball|false/});
	  		if (res) {
	  			console.log("res", res)
	  			let arrayResults = res.split('\n');
	  			if (arrayResults.length == 2) {
	  				return false;
	  			} else if (arrayResults.length == 3) {
	  				let arrayResults = res.split('\n');
	  				let resultGame = eval('(' + arrayResults[1] + ')');
	  				resultGame.success = true;
	  				return resultGame;
	  			} else {
	  				this.runTelenetConnect();
	  				return false;
	  			}
	  		} else {
	  			this.runTelenetConnect();
	  			return false;
	  		}
	  	} catch(err) {
	  		this.runTelenetConnect();
	  		return false;
	  	}
	  return false;
	}
}
module.exports.LottoMachine = LottoMachine;
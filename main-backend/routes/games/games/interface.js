// imports
let { LottoMachine } = require('../lotto-machine/lotto-machine.js');
let { Players } = require('./players.js');

let lotto = new LottoMachine();

class Interface {
	gameName;
	players;

	constructor(gameName, dataFromPlayerHandler) {
		return(async() => {
			this.gameName = gameName;
			this.players = await new Players(gameName, dataFromPlayerHandler);
			return this;
		})();
	}

	async sendToAllPlayer(name, info) {
		this.players.sendAll("/"+this.gameName, this.gameName + name, info);
	}	

	async clearDisplay(){
		if (process.env.DEV !== "true") await lotto.sendCommand("cleardisplay");
		else return false
	}

	async sendToOnePlayer(userKey, name, info, bot = false) {
		this.players.sendOne("/"+this.gameName, this.gameName + name, info, bot, userKey);
	}

	async dropOneBall(name) {
		if (process.env.DEV !== "true") {
			let res = await lotto.sendCommandStartDraw();
			if (!res) return false;
			return res.ball;
		} else {
			let promise = new Promise((resolve, reject) => {
				let ball = Math.floor(Math.random() * 37);
				setTimeout(() => resolve(ball), 7000);
			});
			let result = await promise;
			return result
		}		
	}
}
module.exports.Interface = Interface;
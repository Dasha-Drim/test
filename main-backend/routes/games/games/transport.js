const cookie = require('cookie');
const jwt = require('../../../modules/jwt.js');
const { Bot } = require("../bot/botBingo37.js");

class Transport {
	ioServer;
	gameName;
	registerNewPlayerCallback;
	newMessageToPlayerCallback;
	bot;

	constructor(gameName, registerNewPlayerCallback, newMessageFromPlayerCallback) {
		return(async() => {
			this.gameName = gameName;
			this.registerNewPlayerCallback = registerNewPlayerCallback;
			this.newMessageFromPlayerCallback = newMessageFromPlayerCallback;
			this.bot = await new Bot(this.gameName, this.getByBotChannel, newMessageFromPlayerCallback);
			return this;
		})();
	}
	
	async ioConnection() {
		let getIORecur = (resolve) => {
			if(typeof io === "undefined") setTimeout(() => getIORecur(resolve), 50);
			else resolve(io);
		}
		let getIO = new Promise(function(resolve, reject) {
			getIORecur(resolve);
		});
		this.ioServer = await getIO;
		await this.initSocketListner();
		return true;
	}

	async sendBySocket(of, name, info, to = null) {
		if (!to) this.ioServer.of(of).emit(name, info);
		else this.ioServer.of(of).to(to).emit(name, info);
	}

	async initSocketListner() {
		let classThis = this;
		this.ioServer.of('/'+this.gameName).on('connection', async (socket) => {
			const cookies = cookie.parse(socket.request.headers.cookie || '');
			let id, idUser;
			if (cookies.token) id = jwt.ioUpdateJWT(cookies.token, socket.request.headers.cookie, socket.request.headers["user-agent"]);
			if ((id && id.role == 'user') || (id && id.role == 'user-offline')) idUser = id.id;

			socket.on('setSocketId', async (data) => {
				if (!data.userKey) return false;
				await classThis.registerNewPlayerCallback(classThis.gameName, data.socketID, data.userKey, data.demo, idUser || null);
			})

			let eventName = classThis.gameName+'_Game';
			socket.prependAny(async (eventName, data) => {
  				await classThis.newMessageFromPlayerCallback(socket.id, data);
			});
		})
	}

	async sendByBotChannelID(of, name, data) {
		this.bot.getInfo(of, name, data);
	}

	async getByBotChannel(data) {
		await this.newMessageFromPlayerCallback(1, data);
	}

}
module.exports.Transport = Transport;


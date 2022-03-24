let { Transport } = require('./transport.js');

const Bingo37Demo = require('../../../models/Bingo37Demo.js');
const BingoXDemo = require('../../../models/BingoXDemo.js');
const PlayersDB = require('../../../models/Players.js');

class Players {
	transport;
	gameName;
	dataFromPlayerHandler;
	currentGameDemo;

	constructor(gameName, dataFromPlayerHandler, ) {
		return(async() => {
			this.dataFromPlayerHandler = dataFromPlayerHandler;
			// to save context
			this.registerNewPlayer = this.registerNewPlayer.bind(this);
			this.newMessageFromPlayer = this.newMessageFromPlayer.bind(this);

			this.transport = await new Transport(gameName, this.registerNewPlayer, this.newMessageFromPlayer);
			this.gameName = gameName;
			if (gameName === "bingo37") this.currentGameDemo = Bingo37Demo;
			if (gameName === "bingoX") this.currentGameDemo = BingoXDemo;
			await this.transport.ioConnection();
			return this;
		})();
	}

	async _searchUserKeyBySocketID (socketID) {
		let user = await PlayersDB.findOne({socketID: socketID});
		let demoUser = await this.currentGameDemo.findOne({socketID: socketID});
		if (!user && !demoUser) return false;
		return user ? user.userKey : demoUser.userKey;
	}


	async registerNewPlayer(gameName = null, socketID = null, userKey = null, demo = null, idUser = null) {
		let demoMode = !((idUser) && (!demo));
		let userNotDemo = await PlayersDB.findOne({userKey: userKey});
		if(!demoMode) {
			await PlayersDB.updateOne({idUser: idUser}, {$set: {socketID: socketID, userKey: userKey}}, {upsert: false});
			await this.currentGameDemo.deleteOne({userKey: userKey});
		}

		if(demoMode) {
			if (userNotDemo) await PlayersDB.updateOne({userKey: userKey}, {$set: {userKey: null}}, {upsert: false})
			let user = await this.currentGameDemo.findOne({userKey: userKey})
			if (!user) {
				await this.currentGameDemo({socketID: socketID, userKey: userKey}).save();
			} else {
				await this.currentGameDemo.updateOne({userKey: user.userKey}, {$set: {socketID: socketID}}, {upsert: false});
			}
		}
		this.dataFromPlayerHandler("NEW_PLAYER", userKey);
	}

	async newMessageFromPlayer(socketID = null, data = null) {
		if(socketID === 1) this.dataFromPlayerHandler("NEW_DATA_FROM_PLAYER", data.userKey, data);
		let userKey = await this._searchUserKeyBySocketID(socketID);
		if (!userKey) return;
		this.dataFromPlayerHandler("NEW_DATA_FROM_PLAYER", userKey, data);
		// НАПРАВИТЬ В ИГРУ ПРОСЬБУ ОБРАБОТАТЬ ПРИШЕДШИЕ ОТ ИГРОКА ДАННЫЕ*/
	}

	async sendOne(of, name, data, bot, userKey) {
		let socketID, user;
		user = await PlayersDB.findOne({userKey: userKey});
		if(user) {
			socketID = user.socketID;
			this.transport.sendBySocket(of, name, data, socketID);
		} else {
			if (bot) {
				this.transport.sendByBotChannelID(of, name, data);
			} else {
				user = await this.currentGameDemo.findOne({userKey: userKey})
				socketID = user.socketID;
				this.transport.sendBySocket(of, name, data, socketID);
			}
		}
	}
	async sendAll(of, name, data) {
		this.transport.sendBySocket(of, name, data);
		this.transport.sendByBotChannelID(of, name, data);
	}
}

module.exports.Players = Players;
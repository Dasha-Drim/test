//imports
let calculateWinningBingo37 = require('./bingo37Calculation.js');
const { Interface } = require("./interface.js");

const Players = require('../../../models/Players.js');
const Bingo37Rounds = require('../../../models/Bingo37Rounds.js');
const Bingo37Demo = require('../../../models/Bingo37Demo.js');
const GamesLog = require('../../../models/GamesLog.js');
const GameLogBot = require('../../../models/GameLogBot.js');

class Bingo37 {
	currentStep = {};
	roundDuration = 75;
	currentRoundID;
	resultsIsSended = false;
	interface = null;
	timeLeft;
	lastNum;
	stepLimits;

	steps = [
	{  
		name: "acceptingBids",
		stepLength: 45,
		interval: [0, 45],
		miniSteps: [
		{
			name: "acceptingBidsStarts",
			description: "Betting has begun",
			action: this.acceptingBidsStarts.bind(this),
			interval: [0, 4],
		},
		{
			name: "acceptingBidsInProcess",
			action: this.acceptingBidsInProcess.bind(this),
			description: "Accepting bets",
			interval: [5, 39]
		},
		{
			name: "acceptingBidsComingToEnd",
			action: this.acceptingBidsComingToEnd.bind(this),
			description: "Bets are coming to end",
			interval: [40, 45],
		}
		]
	},
	{
		name: "drawing",
		stepLength: 30,
		interval: [45, 75],
		miniSteps: [
		{
			name: "drawingStarts",
			action: this.drawingStarts.bind(this),
			description: "Draw has started",
			interval: [45, 49],
		},
		{
			name: "drawingInProcess",
			action: this.drawingInProcess.bind(this),
			description: "Draw in progress",
			interval: [50, 75],
		}
		]
	},
	{
		name: "results",
		interval: ["-", "-"]
	}
	];

	constructor() {
		return(async() => {
			this.dataFromPlayerHandler = this.dataFromPlayerHandler.bind(this);
			let interface2 = await new Interface("bingo37", this.dataFromPlayerHandler);
			this.interface = interface2;
			await this.createNewRound();
			
			return this;
		})();
	}


	async createNewRound() {
		let newRound = await Bingo37Rounds({}).save();
		this.currentRoundID = newRound._id.toString();
	}

	// detect current step and do step action
	checkStepChange(secondsInTicker) {
		let seconds = secondsInTicker % this.roundDuration;
		let currentStep = this.steps.find((stepItem) => stepItem.interval[0] <= seconds && seconds < stepItem.interval[1]);
		let currentElement = currentStep.miniSteps.find((item) => item.interval[0] <= seconds && seconds <= item.interval[1]);
		let timeLeft = currentStep.stepLength-(seconds-currentStep.interval[0]);

		this.currentStep = currentElement;
		this.timeLeft = timeLeft;
		this.stepLimits = currentStep.stepLength;

		currentElement.action(timeLeft);
	}

	// returns current step
	get currentStep() {
		return this.currentStep;
	}

	// returns round duration
	get roundDuration() {
		return this.roundDuration;
	}

	calculateTotalBid(userBetsArray = []) {
  		let price = 0;
  		userBetsArray.forEach(item => {
	    	let { money } = item;
	    	let totalBid = money.reduce((sum, current) => sum + current, 0);
	    	price += totalBid;
  		})
  		return price;
	}

	dataFromPlayerHandler(status, userKey, data) {
		if(status === "NEW_PLAYER") this._onNewPlayer(userKey);
		if(status === "NEW_DATA_FROM_PLAYER") this._onSendBets(userKey, data);
	}


	async _onNewPlayer(userKey) {
		// НОВЫЙ ИГРОК ПРИСОЕДИНИЛСЯ К ИГРЕ
		let round = await Bingo37Rounds.find({num: {$exists: true}}).limit(25).sort({_id: -1});
		let nums = [];

		for (let i = 0; i < round.length; i++) {
			if(round[i].num) nums.push(round[i].num);
		}
		await this.interface.sendToOnePlayer(userKey, '_Game fell-out-last', {nums: nums});

		if(!this.resultsIsSended) {
			await this.interface.sendToOnePlayer(userKey, '_Game '+this.currentStep.name, {text: this.currentStep.description, stepLimits: this.stepLimits, timeLeft: this.timeLeft});
			 if (this.lastNum) await this.interface.sendToOnePlayer(userKey, '_Game last-number', {num: this.lastNum});
		} else {
			// inform about results
			await this.interface.sendToOnePlayer(userKey, '_Game raffle-is-completed', {text: "Result", num: this.lastNum, stepLimits: this.stepLimits, timeLeft: this.timeLeft});
		}
	}

	async _onSendBets(userKey, data) {
		// ИГРОК ОТПРАВИЛ НАМ СТАВКИ
		if ((!data.bets) && (!data.bets.length)) return false;
		let round = await Bingo37Rounds.findOne().sort({_id: -1});
		
		if (userKey === 1) {
			let price = this.calculateTotalBid(data.bets);
			let bets = [];
			if (round.bets && round.bets.length) bets = round.bets;
			bets.push({userKey: userKey, bets: data.bets, bot: true});
			await Bingo37Rounds.updateOne({_id: this.currentRoundID}, {$set: {bets: bets}}, {upsert: false});
			await new GameLogBot({gameName: "bingo37", bets: data.bets, price: +price, roundId: round._id.toString()}).save();
		}
		let user = await Players.findOne({userKey: userKey});
		
		if((user) && (!data.demo)) {
			// it's user
			let price = this.calculateTotalBid(data.bets);
			let balance = +user.balance;
			let bonus = +user.bonus || 0;
			let allBalance = +balance + +bonus;
			let remainingMoney = +price;

			if(price <= allBalance) {
				let bets = [];
				if (round.bets && round.bets.length) bets = round.bets;
				bets.push({userKey: userKey, bets: data.bets});
				await Bingo37Rounds.updateOne({_id: this.currentRoundID}, {$set: {bets: bets}}, {upsert: false});
				if (bonus) remainingMoney = +bonus - +price;
				else remainingMoney = 0 - +price;

				if (remainingMoney > 0) bonus = +remainingMoney;
				if (remainingMoney < 0) {
					bonus = 0;
					balance = +balance + +remainingMoney;
				}
				if (remainingMoney == 0) {
					bonus = 0;
					balance = +balance;
				}
				await Players.updateOne({userKey: userKey}, {$set: {balance: +balance, bonus: +bonus}}, {upsert: false})
				await GamesLog({gameName: "bingo37", player: user.idUser.toString(), amount: price, type: "bet", currentRoundID: this.currentRoundID.toString()}).save();
			}  
		} else {
			// it's not user, it's demo-player
			let userDemo = await Bingo37Demo.findOne({userKey: userKey});

			if (!userDemo) return userKey = false;
			let bets = [];
			if (round.bets && round.bets.length) bets = round.bets;
			bets.push({userKey: userKey, bets: data.bets});
			await Bingo37Rounds.updateOne({_id: this.currentRoundID}, {$set: {bets: bets}}, {upsert: false});
		}
	}


	async acceptingBidsStarts () { 
		this.resultsIsSended = false;
		await this.interface.sendToAllPlayer('_Game acceptingBidsStarts', {text: this.currentStep.description, stepLimits: this.stepLimits, timeLeft: this.timeLeft});
	}

	async acceptingBidsInProcess() {
		await this.interface.sendToAllPlayer('_Game acceptingBidsInProcess', {text: this.currentStep.description, stepLimits: this.stepLimits, timeLeft: this.timeLeft});
	}

	async acceptingBidsComingToEnd() {
		await this.interface.sendToAllPlayer('_Game acceptingBidsComingToEnd', {text: this.currentStep.description, stepLimits: this.stepLimits, timeLeft: this.timeLeft});
		await this.interface.clearDisplay();
	}

	async drawingStarts() {
		if (this.resultsIsSended) return;
		
		// inform player
		await this.interface.sendToAllPlayer('_Game drawingStarts', {text: this.currentStep.description, stepLimits: this.stepLimits, timeLeft: this.timeLeft});
		
		// drop one ball
		let num = await this.interface.dropOneBall();
		console.log("num", num);
		if (!num || num === false) {
			await this.interface.sendToAllPlayer('_Game error', {text: "An error occurred, please refresh the page", title: "Error"});
			let round = await Bingo37Rounds.findOne({}).sort({_id: -1});
			if (!round.bets) return;
			for (let i = 0; i < round.bets.length; i++) {
				let userDemo = await Bingo37Demo.findOne({userKey: round.bets[i].userKey});
				if (userDemo) return;
				let price = this.calculateTotalBid(round.bets[i].bets);
				let player = await Players.findOne({userKey: round.bets[i].userKey});
				if (!player) return;
				await Players.updateOne({userKey: round.bets[i].userKey}, {$set: {balance: player.balance + price}});
				return;
			}
		}
		this.lastNum = +num+1;
		await Bingo37Rounds.updateOne({_id: this.currentRoundID}, {$set: {num: this.lastNum}}, {upsert: false});
		await GameLogBot.updateOne({roundId: this.currentRoundID.toString()}, {$set: {num: this.lastNum}}, {upsert: false});

		// inform player about dropped ball
		await this.interface.sendToAllPlayer('_Game raffle-is-completed', {text: "Result", num: this.lastNum, stepLimits: this.stepLimits, timeLeft: this.timeLeft});
		this.resultsIsSended = true;

		// get current round and create new one
		let round = await Bingo37Rounds.findOne({}).sort({_id: -1});
		this.currentRoundID = await Bingo37Rounds({}).save();


		// generate list of winners
		let winArray = [];
		
		if (!round.bets) return;
		for (let i = 0; i < round.bets.length; i++) {
			let win = calculateWinningBingo37(round.bets[i].bets, this.lastNum);
			let winItem = {win: win, player: round.bets[i].userKey, demo: false};
			let userDemo = await Bingo37Demo.findOne({userKey: round.bets[i].userKey});
			if (userDemo) winItem.demo = true;
			if (round.bets[i].bot) { 
				winItem.bot = true;
				winItem.demo = true;
			}
			winArray.push(winItem)
		}
		// inform player about win
		for (let i = 0; i < winArray.length; i++) {
			if (!winArray[i].demo) {
				let player = await Players.findOne({userKey : winArray[i].player});
				if (!player) return;
				await GamesLog({gameName: "bingo37", player: player.idUser, amount: +winArray[i].win, type: "win", currentRoundID: round._id.toString()}).save();
				await Players.updateOne({userKey : winArray[i].player}, {$set: {balance: +player.balance + +winArray[i].win}}, {upsert: false})
				await this.interface.sendToOnePlayer(winArray[i].player, '_Game your-win', {win: winArray[i].win});
			} else {
				if (winArray[i].bot) {
					await GameLogBot.updateOne({roundId: round._id.toString()}, {$set: {win: winArray[i].win}}, {upsert: false});
					await this.interface.sendToOnePlayer(winArray[i].player, '_Game your-win', {win: winArray[i].win}, true);
				} else {
					await this.interface.sendToOnePlayer(winArray[i].player, '_Game your-win', {win: winArray[i].win});
				}
			}
		}
	}

	async drawingInProcess(timeLeft) {
		if (this.resultsIsSended) return;
		await this.interface.sendToAllPlayer('_Game drawingInProcess', {text: "Draw in progress", stepLimits: 30, timeLeft: timeLeft});
	}


}

module.exports.Bingo37 = Bingo37;
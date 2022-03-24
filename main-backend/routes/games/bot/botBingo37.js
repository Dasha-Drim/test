let config = require('../../../config/config.js');
const Telnet = require('telnet-client')

class Bot {
	gameName;

	/*constructor(gameName, sendByBotChannel) {
		this.gameName = gameName;
		this.sendByBotChannel = sendByBotChannel;
	}*/

	constructor(gameName, sendByBotChannel, newMessageFromPlayerCallback) {
		return(async() => {
			this.gameName = gameName;
			this.sendByBotChannel = sendByBotChannel;
			this.newMessageFromPlayerCallback = newMessageFromPlayerCallback;
			return this;
		})();
	}

	getRandomBet() {
		let randomInteger = (min, max) => {
			let rand = min - 0.5 + Math.random() * (max - min + 1);
			return Math.round(rand);
		};

		let compare = (a1, a2) => {
			return a1.length == a2.length && a1.every((v, i) => v === a2[i]);
		};

		let generateAvailableBets = () => {
			let betsArr = [];
			let recursive = (number = 1) => {
				if (number % 3 !== 0) {
					betsArr.push([number]);
					betsArr.push([number, number + 1]);
					if (
						number !== 10 &&
						number !== 11 &&
						number !== 12 &&
						number !== 22 &&
						number !== 23 &&
						number !== 24 &&
						number !== 34 &&
						number !== 35 &&
						number !== 36
						)
						betsArr.push([number, number + 1, number + 3, number + 4]);
				}

				if (
					number !== 10 &&
					number !== 11 &&
					number !== 12 &&
					number !== 22 &&
					number !== 23 &&
					number !== 24 &&
					number !== 34 &&
					number !== 35 &&
					number !== 36
					)
					betsArr.push([number, number + 3]);

				if (number === 36) {
					betsArr.push([37]);
					return false;
				}
				recursive(number + 1);
			};
			recursive();


			betsArr.push([1,2,3,4,5,6,7,8,9,10,11,12]);
			betsArr.push([13,14,15,16,17,18,19,20,21,22,23,24]);
			betsArr.push([25,26,27,28,29,30,31,32,33,34,35,36]);


			betsArr.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]);
			betsArr.push([19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]);


			betsArr.push([3,6,9,12]);
			betsArr.push([2,5,8,11]);
			betsArr.push([1,4,7,10]);

			betsArr.push([15,18,21,24]);
			betsArr.push([14,17,20,23]);
			betsArr.push([13,16,19,22]);

			betsArr.push([27,30,33,36]);
			betsArr.push([26,29,32,35]);
			betsArr.push([25,28,31,34]);


			betsArr.push([3,6,9,12,15,18,21,24,27,30,33,36]);
			betsArr.push([2,5,8,11,14,17,20,23,26,29,32,35]);
			betsArr.push([1,4,7,10,13,16,19,22,25,28,31,34]);

			return betsArr;
		};

		let generateAvailableBetsX = () => {
			let betsArr = [];
			let recursive = (number = 1) => {
				if (number % 3 !== 0) {
					betsArr.push([number]);
					betsArr.push([number, number + 1]);
					if (
						number !== 34 &&
						number !== 35 &&
						number !== 36
						)
						betsArr.push([number, number + 1, number + 3, number + 4]);
				}

				if (
					number !== 34 &&
					number !== 35 &&
					number !== 36
					)
					betsArr.push([number, number + 3]);

				if (number === 36) {
					betsArr.push([37]);
					return false;
				}
				recursive(number + 1);
			};
			recursive();


			betsArr.push([1,2,3,4,5,6,7,8,9,10,11,12]);
			betsArr.push([13,14,15,16,17,18,19,20,21,22,23,24]);
			betsArr.push([25,26,27,28,29,30,31,32,33,34,35,36]);


			betsArr.push([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]);
			betsArr.push([19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]);


			betsArr.push([2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36]);
			betsArr.push([1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35]);


			betsArr.push([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
			betsArr.push([2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35]);


			betsArr.push([3,6,9,12,15,18,21,24,27,30,33,36]);
			betsArr.push([2,5,8,11,14,17,20,23,26,29,32,35]);
			betsArr.push([1,4,7,10,13,16,19,22,25,28,31,34]);


			betsArr.push([34,37]);
			betsArr.push([35,37]);
			betsArr.push([36,37]);
			betsArr.push([34,35,37]);
			betsArr.push([35,36,37]);

			return betsArr;
		};

		let betsArray = [];
		let availableBets;
		if (this.gameName == "bingo37") availableBets = generateAvailableBets();
		if (this.gameName == "bingoX") availableBets = generateAvailableBetsX();
		 
		let availablePrices = [10, 50, 100, 500, 1000];
		let numOfChipsBetted = randomInteger(2, 20);

		for (let i = 0; i < numOfChipsBetted; i++) {
			let newCell = availableBets[randomInteger(0, availableBets.length - 1)];
			let newPrice =
			availablePrices[randomInteger(0, availablePrices.length - 1)];

			let hasInFinalArray = false;

			betsArray.forEach((betItem, id) => {
				if (compare(betItem.bet, newCell)) {
					hasInFinalArray = true;
					betItem.money.push(newPrice);
				}
			});
			if (!hasInFinalArray) {
				betsArray.push({
					bet: newCell,
					money: [newPrice]
				});
			}
		}
		this.sendByBotChannel({ bets: betsArray, demo: true, bot: true, userKey: 1 })
	}

	getInfo(of, name, data) {
		let step = name.split(" ");
		if (step[1] == "drawingStarts") this.getRandomBet();
	}
}

module.exports.Bot = Bot;
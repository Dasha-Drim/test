// import
const CronJob = require('cron').CronJob;
const { BingoX } = require('./games/bingoXSteps.js');
const { Bingo37 } = require('./games/bingo37Steps.js');


(async function() {


let a = await new BingoX();
let b = await new Bingo37();


let seconds = 0;
let games = [a, b]
//let games = [b]
let intervals = [];


// search max game time
games.forEach(item => {
	intervals.push(item.roundDuration);
})


// nok
let NOK = (numbers) => {
    let a = numbers[0];
    for (let i = 1; i < numbers.length; i++) { 
    	let b = numbers[i], c = a;
       	while (a && b){ a > b ? a %= b : b %= a } 
       	a = c*numbers[i]/(a+b);
    }
    return a;
}
let resetSecond = NOK(intervals);


// every 5 seconds do action in games
let job = new CronJob('*/5 * * * * *', function() {
	if (resetSecond === seconds) seconds = 0;
	games.forEach(item => {
		item.checkStepChange(seconds);
	})
	seconds += 5;
},
null,
true,
'America/Los_Angeles'
);

})();
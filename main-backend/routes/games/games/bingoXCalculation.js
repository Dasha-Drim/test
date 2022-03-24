module.exports = function calculateWinning(userBets, number) {
    let coef1 = 36;
    let coef2 = 18;
    let coef3 = 12;
    let coef4 = 9;
    let coef5 = 3;
    let coef6 = 2;

    let arr = userBets;

    let win = 0;

    for(let i = 0; i < arr.length; i++) {
        let bet = arr[i]["bet"];
        let money = arr[i]["money"];
        // finding the length of the "bet" array to select the desired coefficient
        let betLength = bet.length; 
        let sumMoney = 0;
        let searchNumberInBet = false;

        for (let n = 0; n < betLength; n++){
            // search in the "bet" array for a value corresponding to a randomly generated value
            if (bet[n] == number) searchNumberInBet = true;
        }

        // finding the sum of the "money" array
        for (let l = 0; l < money.length; l++) {
            sumMoney += money[l];
        }

        if (searchNumberInBet) {
            // finding the desired coefficient and finding the product of the coefficient and the win.
            if (betLength == 1) win += sumMoney*coef1;
            if (betLength == 2) win += sumMoney*coef2;
            if (betLength == 3) win += sumMoney*coef3;
            if (betLength == 4) win += sumMoney*coef4;
            if (betLength == 12) win += sumMoney*coef5;
            if (betLength == 18) win += sumMoney*coef6;
        }
    }

    return win;
}
// 1. deposit some money
// 2. determine number of lines to bet on
// 3. collect a bet amount
// 4. spin the slot machine
// 5. check if the user won
// 6. give the user their winnings
// 7. play again

//to play: run [node main.js] in terminal

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLUMNS = 3;

//number of each symbol
const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

//multipler or value of each symbol
const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount: ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, try again");
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLines = parseInt(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Invalid number of lines, try again");
    } else {
      return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the bet per line: ");
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("Invalid bet amount, try again");
    } else {
      return numberBet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    //loop through the count of each symbol
    for (let i = 0; i < count; i++) {
      symbols.push(symbol); //push the symbol to the array
    }
  }

  const reels = []; //initialize the reels
  for (let i = 0; i < COLUMNS; i++) {
    reels.push([]); //push an empty array to the reels array
    const reelSymbols = [...symbols]; //copy the symbols array
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol); //push the selected symbol to the reel
      reelSymbols.splice(randomIndex, 1); //remove the selected symbol
    }
  }

  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLUMNS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i < row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winnings += SYMBOL_VALUES[symbols[0]] * bet;
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log("Balance: $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines; //subtract the bet amount from the balance
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log("You won, $" + winnings.toString());

    if (balance <= 0) {
      console.log("You have run out of money!");
      break;
    }

    const playAgain = prompt("Do you want to play again? (y / n): ");

    if (playAgain != "y") break; //exit the loop if the user does not want to play again
  }
};

game();

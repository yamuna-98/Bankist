"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2021-10-27T17:01:17.194Z",
    "2022-01-11T23:36:17.929Z",
    "2022-01-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const formatMovementDates = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return "Today";
  else if (daysPassed === 1) return "Yesterday";
  else if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
  // const disDate =`${date.getDate()}`.padStart(2,0);
  // const month =`${date.getMonth()+1}`.padStart(2,0);
  // const year = date.getFullYear();
  // return `${disDate}/${month}/${year}`;
};
const formattedCurr = function (value, locale, cur) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: cur,
  }).format(Math.abs(value));
};

// displayMovements
const displayMovements = function (acc, sort) {
  const moves = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  console.log(moves);
  containerMovements.innerHTML = "";
  moves.forEach(function (value, index) {
    const transaction = value > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${transaction}">${
      index + 1
    } ${transaction} </div>
    <div class="movements__date">${formatMovementDates(
      new Date(acc.movementsDates[index]),
      acc.locale
    )}</div> 
    <div class="movements__value">${formattedCurr(
      value,
      acc.locale,
      acc.currency
    )}</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//displayMovements(movements);
//display balance
//using reduce method
const currentBalance = function (obj) {
  obj.totalBalance = obj.movements.reduce(function (cal, el) {
    return (cal += el);
  }, 0);
  labelBalance.textContent = formattedCurr(
    obj.totalBalance,
    obj.locale,
    obj.currency
  );
};
//currentBalance(movements);

//creating usernames
const createUserName = function (accounts) {
  accounts.forEach(function (element) {
    const userName = element.owner
      .split(" ")
      .map(function (el) {
        return el[0];
      })
      .join("")
      .toLowerCase();
    element.userName = userName;
  });
};
createUserName(accounts);
console.log(accounts);

const calcDisplaySummary = function (account) {
  //1.Display total deposits
  const displayDeposits = account.movements
    .filter((el) => el > 0)
    .reduce((sum, el) => sum + el, 0);
  labelSumIn.textContent = formattedCurr(
    displayDeposits,
    account.locale,
    account.currency
  );

  //2.Display total Withdrawals
  const displayWithdrawls = account.movements
    .filter((el) => el < 0)
    .reduce((sum, el) => sum + el, 0);
  labelSumOut.textContent = formattedCurr(
    Math.abs(displayWithdrawls),
    account.locale,
    account.currency
  );

  //3.Display total Interest
  const displayInterest = account.movements
    .filter((el) => el > 0)
    .map((el) => (el * account.interestRate) / 100)
    .reduce((sum, el) => sum + el, 0);
  labelSumInterest.textContent = formattedCurr(
    displayInterest,
    account.locale,
    account.currency
  );
};
// calcDisplaySummary(movements);

const euroToUSD = 1.1;
//Using Map
const movementsUSD = movements.map(function (el) {
  return el * euroToUSD;
});
console.log(movementsUSD);

const movementDescriptions = movements.map(function (amt, index) {
  return `Movement ${
    index + 1
  }: You ${amt > 0 ? "deposited" : "withdrew"} ${Math.abs(amt)}`;
});
console.log(movementDescriptions);

//using filter method
const deposits = movements.filter((el) => el > 0);
console.log(deposits);

const withdrwals = movements.filter((el) => el < 0);
console.log(withdrwals);

console.log(Math.max(...movements));

//doubt
const maximum = movements.reduce(function (greater, el) {
  greater = Math.max(greater, el);
  // if(greater<el){
  //    greater=el;
  //   }
  return greater;
}, movements[0]);
console.log(maximum);

// chaining example
const totalDeposits = movements
  .filter((el) => el > 0)
  .map((el) => el * 1.1)
  .reduce((sum, el) => sum + el, 0);
console.log(totalDeposits);

//find method
const arr = [];
function neagtive(movements) {
  for (let value of movements) {
    if (value < 0) {
      arr.push(value);
    }
    if (arr.length == 2) {
      return arr;
    }
  }
  return arr;
}
console.log(neagtive(movements));

const neg = movements.find(function (value) {
  return value < 0;
});
console.log(neg);

//'Jessica Davis'
const account = accounts.find(function (o, i, a) {
  console.log(o, i, a);
  return o.owner === "Jessica Davis";
});
console.log(account);

const updateUI = function () {
  calcDisplaySummary(currentAccount);
  currentBalance(currentAccount);
  displayMovements(currentAccount);
};
//call the timer
const startLogOutTimer = function () {
  const tick = function () {
    const minute = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${minute}:${second}`;
    time--;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
  };
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
let currentAccount, timer;
//implementing login method
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(function (obj) {
    return obj.userName === inputLoginUsername.value;
  });
  console.log(currentAccount);
  if (currentAccount.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome,${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    document.addEventListener("click", function () {
      if (timer !== undefined) clearInterval(timer);
      timer = startLogOutTimer();
    });
  }
  updateUI();
});
// sorting
let sorted = false;
btnSort.addEventListener("click", function () {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//implementing transfer money
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const element = accounts.find((el) => el.userName === inputTransferTo.value);
  if (element) {
    if (
      element.userName !== currentAccount.userName &&
      inputTransferAmount.value > 0 &&
      inputTransferAmount.value < currentAccount.totalBalance
    ) {
      element.movements.push(+inputTransferAmount.value);
      element.movementsDates.push(new Date());
      currentAccount.movements.push(-inputTransferAmount.value);
      currentAccount.movementsDates.push(new Date());
      updateUI();
    } else {
      alert("cannot transfer to your own account");
    }
  } else {
    alert("Invalid Id");
  }
  inputTransferTo.value = inputTransferAmount.value = "";
});

function anyDeposit(obj, rqstAmt) {
  // const percentage=rqstAmt*(0.1)+rqstAmt;
  const percentage = rqstAmt * 1.1;
  //some-checks if any element in an array satisfies the given condition and returns a boolean value
  const deposits = obj.movements.some((value) => value > percentage);
  return deposits;
}
// if(deposits===undefined){
//   return false;
// }
// else{
//   return true;
// }

// Requesting loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const rqstAmt = Math.floor(inputLoanAmount.value);
  const qualifiedForLoan = anyDeposit(currentAccount, rqstAmt);
  if (qualifiedForLoan) {
    setTimeout(function () {
      currentAccount.movements.push(rqstAmt);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI();
    }, 2500);
  }
  inputLoanAmount.value = "";
  // clearInterval(timer);
  // timer = startLogOutTimer();
});

// Close Account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const closeAccountIndex = accounts.findIndex(function (obj) {
      return obj.userName === currentAccount.userName;
    });
    accounts.splice(closeAccountIndex, 1);

    containerApp.style.opacity = 0;
  }
  labelWelcome.textContent = `Log in to get started`;
  inputCloseUsername.value = "";
  inputClosePin.value = "";
});
// every-checks whether every element in an array satisfies the given condition and returns a boolean value.
const ex3 = [1, 2, 4, 6, 8];
let isEven = true;
for (let value of ex3) {
  if (value % 2 !== 0) {
    isEven = false;
    break;
  }
}
console.log(isEven);
//flat-flattens up the multi-dimensional array into a one-dimensional array n returns a new array.
const test = [1, 2, [[3, 4]], [[[5, 6, 7]]]];
test.flat(2); //[1,2,3,4[5,6,7]]
const eg = test.flat(3); //[1,2,3,4,5,6,7]
console.log(...eg); // 1 2 3 4 5 6 7

// const accountMovments=accounts.map(function(obj){
//   return obj.movements;
// })
// console.log(accountMovments);
// const totalMovements=accountMovments.flat();
// console.log(totalMovements);
// const totalSum=totalMovements.reduce((cal,el)=>cal+el,0);
// console.log(totalSum);

const totalSum = accounts
  .flatMap((obj) => obj.movements)
  .reduce((cal, el) => cal + el, 0);
console.log(totalSum);

// * for each*/
// for (const values of movements){
//     console.log(values);
// }

// movements.forEach(function(el,idx,arr){
//     console.log(el,idx,arr);
// })

//map method
// const userJonas="Jonas Schmedtmann";
// const arr2 =[];
// for(const value of arr){
//     arr2.push(value[0]);
// }

// const arr=userJonas.split(' ');
// const arr2 = arr.map(function(el){
//     return el[0];
// })
// console.log(arr2.join('').toLowerCase());
// const userName = userJonas.split(' ').map(function(el){
//     return el[0]}).join('').toLowerCase();

//sort
console.log("before sort : " + movements);
movements.sort();
console.log("after sort : " + movements);

movements.sort((a, b) => {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
});
console.log("ascending order : " + movements);

movements.sort((a, b) => {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
});
console.log("descending order : " + movements);

movements.sort((a, b) => a - b);
console.log("ascending order : " + movements);

movements.sort((a, b) => b - a);
console.log("descending order : " + movements);

//setTimeOut
const ingredients = ["olives", "spinach"];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your Pizza with ${ing1} & ${ing2}`),
  3000,
  ...ingredients
);

const ingredients2 = ["olives", "spinach", "corn"];
const pizzaTimer2 = setTimeout(
  (ing1, ing2) => console.log(`Here is your Pizza with ${ing1} & ${ing2}`),
  3000,
  ...ingredients
);
if (ingredients2.includes("spinach")) clearTimeout(pizzaTimer2);

//setInterval
// setInterval(
//   () => console.log( Intl.DateTimeFormat(navigator.locale,
//         { timeStyle: 'medium' }).format( new Date() )),
//   1000
// );
// setInterval(() => {
//  console.log(Intl.DateTimeFormat(navigator.locale, { timeStyle: "medium" }).format(new Date())),
//  setTimeout(() => console.clear(), 1900)},1000);
/////////////////////////////////////////////////

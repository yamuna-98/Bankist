// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

let currentAccount;

// create userName
// ownersName = Jessica davis -->jd
accounts.forEach((acc) => {
  acc.userName = acc.owner
    .split(" ")
    .map((el) => el[0])
    .join("")
    .toLowerCase();
});
console.log(accounts);
// create deposits
function displayDeposits(account) {
  account.filter((el) => el > 0).reduce();
}

// display Movements
// insertAdjacentHTML()-methods inserts a text as Html in a specifie position.
const displayMovements = function (account) {
  containerMovements.innerHTML = "";
  account.movements.forEach((mov, index) => {
    const transaction = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${transaction}">${
      index + 1
    } ${transaction}</div>
    <div class="movements__value">${mov}€</div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// display the total deposits,withdrawals and interest

const calcDisplaySummary = function (account) {
  const deposits = account.movements
    .filter((mov) => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumIn.textContent = `${deposits}€`;

  const withdrawals = account.movements
    .filter((mov) => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumOut.textContent = `${withdrawals}€`;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * account.interestRate) / 100)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// display total balance
const displayTotalBalance = function (account) {
  account.totalBalance = account.movements.reduce((sum, mov) => sum + mov, 0);
  labelBalance.textContent = `${account.totalBalance}€`;
};
const updateUI = function () {
  displayMovements(currentAccount);
  calcDisplaySummary(currentAccount);
  displayTotalBalance(currentAccount);
};

// implementing login
// 1.when the user enter details and click on submit
// 2.we need to check whether the user id is valid/exists
// 3.check the pin is valid
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  if (currentAccount !== undefined) {
    if (currentAccount.pin === +inputLoginPin.value) {
      containerApp.style.opacity = 100;
    } else {
      alert("Incorrect credentials");
    }
  } else {
    alert("Invalid UserId");
  }
  inputLoginUsername.value = inputLoginPin.value = "";
  labelWelcome.textContent = `Welcome,${currentAccount.owner.split(" ")[0]}`;
  updateUI();
});

// implement transfermoney

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const transferTo = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  if (transferTo !== undefined) {
    if (
      transferTo.userName !== currentAccount.userName &&
      inputTransferAmount.value > 0 &&
      inputTransferAmount.value < currentAccount.totalBalance
    ) {
      transferTo.movements.push(+inputTransferAmount.value);
      currentAccount.movements.push(-inputTransferAmount.value);
      updateUI();
    } else {
      alert(
        "cannot transfer to your own account or more than your total balance"
      );
    }
  } else {
    alert("Incorrect ID");
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});
// implementing request Loan
function requestLoan(account, rqstAmt) {
  const percentage = rqstAmt * 1.1;
  return account.movements.some((mov) => mov > percentage);
}
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const rqstAmt = +inputLoanAmount.value;
  const qualifiedForLoan = requestLoan(currentAccount, rqstAmt);
  if (qualifiedForLoan) {
    currentAccount.movements.push(+inputLoanAmount.value);
    updateUI();
  }
  inputLoanAmount.value = "";
});

// implementing close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    // findIndex()- returns the index of the first element that satisfies the even condition.
    const closeAccountIndex = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    accounts.splice(closeAccountIndex, 1);
    containerApp.style.opacity = 0;
  }
  labelWelcome.textContent = "Log in to get started";
  inputCloseUsername.value = inputClosePin.value = "";
});

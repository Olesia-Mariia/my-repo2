function checkCashRegister(price, cash, cid) {
  let change = [];
  let diff = cash - price;
  cid.map(el => change.unshift([...el]));

  change.map(el => {
    switch(el[0]) {
      case "ONE HUNDRED":
        return changeCounter(el, 100);
      case "TWENTY":
        return changeCounter(el, 20);
      case "TEN":
        return changeCounter(el, 10);
      case "FIVE":
        return changeCounter(el, 5);
      case "ONE":
        return changeCounter(el, 1);
      case "QUARTER":
        return changeCounter(el, 0.25);
      case "DIME":
        return changeCounter(el, 0.1);
      case "NICKEL":
        return changeCounter(el, 0.05);
      case "PENNY":
        return changeCounter(el, 0.01);
    }
  });

  switch(drawerStatus(cid)) {
      case "OPEN":
        return {status: "OPEN", 
                change: change.filter(el => el[1] != 0)};
      case "INSUFFICIENT_FUNDS":
        return {status: "INSUFFICIENT_FUNDS", 
                change: []};
      case "CLOSED":
        return {status: "CLOSED", 
                change: change.reverse()};
  }

  function changeCounter(el, unit) {
    if (diff > el[1]){
      diff -= el[1];
      diff = diff.toFixed(2)
      return el;
    }
    if (diff == el[1]) {
      return el;
    }

    let counter = 0;
    while (diff >= unit && counter <= el[1]) {
      counter += unit;
      diff -= unit;
      diff = diff.toFixed(2)
    }
    el[1] = counter
    return el
  }

  function drawerStatus(cid) {
    // "INSUFFICIENT_FUNDS"
    let sum = change.reduce((sum, el) => sum += el[1], 0);
    if (sum < cash - price) {
      return "INSUFFICIENT_FUNDS";
    }

    // "CLOSED"
    cid.reverse()
        .map((el, index) => {
          el[1] = el[1] - change[index][1];
          return el
        });
    if (cid.every(el => el[1] == 0)) {
      return "CLOSED";
    }

    // "OPEN"
    return "OPEN";
  }
}



console.log(
  checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]])
); // {status: "OPEN", change: [["QUARTER", 0.5]]}
console.log(
  checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]])
); // {status: "OPEN", change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]]}
console.log(
  checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])
); // {status: "INSUFFICIENT_FUNDS", change: []}
console.log(
  checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])
); // {status: "INSUFFICIENT_FUNDS", change: []}
console.log(
  checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])
); // {status: "CLOSED", change: [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]}
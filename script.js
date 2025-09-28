const stockPrice = document.getElementById('stockPrice');
const stockValue = document.getElementById('stockValue');
const myAsset = document.getElementById('myAsset');
const myMoney = document.getElementById('myMoney');
const buyBtn = document.getElementById('buyBtn');
const buyBtnVlue = document.getElementById('buyBtnValue');
const sellBtn = document.getElementById('sellBtn');
const sellBtnVlue = document.getElementById('sellBtnValue');
const priceChange = document.getElementById('priceChange');

// 初期値
let stockPriceVal = 0;
let stockValueVal = 0;
let myAssetVal = 0;
let myMoneyVal = 10000;

// 為替レート取得（USD→JPY）
const getStockPriceVal = () => {
  fetch('https://open.er-api.com/v6/latest/USD')
    .then(response => response.json())
    .then(data => {
      const usdToJpy = data.rates.JPY;
      stockPriceVal = Math.round(usdToJpy * 10) - 1000
      stockPrice.textContent = `${stockPriceVal.toLocaleString()}`;
    })
    .catch(error => {
      stockPrice.textContent = 'エラー';
      console.error(error);
    });
}

getStockPriceVal();
setInterval(getStockPriceVal, 60000); // 1分（60,000ミリ秒


stockValue.textContent = stockValueVal.toLocaleString();


myAssetVal = stockPriceVal * stockValueVal;
myAsset.textContent = myAssetVal.toLocaleString();


myMoney.textContent = myMoneyVal.toLocaleString();


buyBtn.addEventListener('click', () => {
  // inputにフォーカスがある場合は処理しない
  if (document.activeElement === buyBtnVlue) return;
  const buyValue = Number(buyBtnVlue.value);
  const totalBuyCost = (stockPriceVal * buyValue) + 10; // 手数料10円
  if (buyValue > 0 && myMoneyVal >= totalBuyCost) {
    stockValueVal += buyValue;
    myMoneyVal -= totalBuyCost;
    stockValue.textContent = stockValueVal.toLocaleString();
    myMoney.textContent = myMoneyVal.toLocaleString();
    myAssetVal = stockPriceVal * stockValueVal;
    myAsset.textContent = myAssetVal.toLocaleString();
    buyBtnVlue.value = '';
  } else if (myMoneyVal < totalBuyCost) {
    alert('現金が足りません');
  } else if (buyValue <= 0) {
    alert('購入株数は0以上で入力してください');
  }
});
sellBtn.addEventListener('click', () => {
  // inputにフォーカスがある場合は処理しない
  if (document.activeElement === sellBtnVlue) return;
  const sellValue = Number(sellBtnVlue.value);
  const totalSellCost = (stockPriceVal * sellValue) - 10; // 手数料10円
  if (sellValue > 0 && stockValueVal >= sellValue) {
    stockValueVal -= sellValue;
    myMoneyVal += totalSellCost;
    stockValue.textContent = stockValueVal.toLocaleString();
    myMoney.textContent = myMoneyVal.toLocaleString();
    myAssetVal = stockPriceVal * stockValueVal;
    myAsset.textContent = myAssetVal.toLocaleString();
    sellBtnVlue.value = '';
  } else if (stockValueVal < sellValue) {
    alert('株数が足りません');
  } else if (sellValue <= 0) {
    alert('売却株数は0以上で入力してください');
  }
});

let previousPrice = stockPriceVal; 
setInterval(() => {
  if (previousPrice !== stockPriceVal) {
    const change = stockPriceVal - previousPrice;
    const changeSign = change > 0 ? '+' : '';
    priceChange.textContent = `${changeSign}${change.toLocaleString()}`;
    previousPrice = stockPriceVal;
  }
}, 1000); // 1秒ごとにチェック

// inputにフォーカスがあるときはbuyBtnとsellBtnのクリックイベントを発火させない
buyBtnVlue.addEventListener('click', (event) => {
  event.stopPropagation();
});
sellBtnVlue.addEventListener('click', (event) => {
  event.stopPropagation();
});
buyBtnVlue.addEventListener('keydown', (event) => {
  event.stopPropagation();
});
sellBtnVlue.addEventListener('keydown', (event) => {
  event.stopPropagation();
});
buyBtnVlue.addEventListener('focus', (event) => {
  event.stopPropagation();
});
sellBtnVlue.addEventListener('focus', (event) => {
  event.stopPropagation();
});
buyBtnVlue.addEventListener('blur', (event) => {
  event.stopPropagation();
});
sellBtnVlue.addEventListener('blur', (event) => {
  event.stopPropagation();
});
buyBtnVlue.addEventListener('change', (event) => {
  event.stopPropagation();
});
sellBtnVlue.addEventListener('change', (event) => {
  event.stopPropagation();
});

// データ保存
function saveData() {
  localStorage.setItem('yh_stockValueVal', stockValueVal);
  localStorage.setItem('yh_myMoneyVal', myMoneyVal);
}

// データ読込
function loadData() {
  const stock = localStorage.getItem('yh_stockValueVal');
  const money = localStorage.getItem('yh_myMoneyVal');
  if (stock !== null) stockValueVal = Number(stock);
  if (money !== null) myMoneyVal = Number(money);
}

// ページ立ち上げ時にローカルストレージから読込
loadData();
stockValue.textContent = stockValueVal.toLocaleString();
myMoney.textContent = myMoneyVal.toLocaleString();
myAssetVal = stockPriceVal * stockValueVal;
myAsset.textContent = myAssetVal.toLocaleString();

// 購入・売却時に保存
buyBtn.addEventListener('click', () => {
  if (document.activeElement === buyBtnVlue) return;
  const buyValue = Number(buyBtnVlue.value);
  const totalBuyCost = (stockPriceVal * buyValue) + 10;
  if (buyValue > 0 && myMoneyVal >= totalBuyCost) {
    stockValueVal += buyValue;
    myMoneyVal -= totalBuyCost;
    stockValue.textContent = stockValueVal.toLocaleString();
    myMoney.textContent = myMoneyVal.toLocaleString();
    myAssetVal = stockPriceVal * stockValueVal;
    myAsset.textContent = myAssetVal.toLocaleString();
    buyBtnVlue.value = '';
    saveData(); // 追加
  } else if (myMoneyVal < totalBuyCost) {
    alert('現金が足りません');
  } else if (buyValue <= 0) {
    alert('購入株数は0以上で入力してください');
  }
});
sellBtn.addEventListener('click', () => {
  if (document.activeElement === sellBtnVlue) return;
  const sellValue = Number(sellBtnVlue.value);
  const totalSellCost = (stockPriceVal * sellValue) - 10;
  if (sellValue > 0 && stockValueVal >= sellValue) {
    stockValueVal -= sellValue;
    myMoneyVal += totalSellCost;
    stockValue.textContent = stockValueVal.toLocaleString();
    myMoney.textContent = myMoneyVal.toLocaleString();
    myAssetVal = stockPriceVal * stockValueVal;
    myAsset.textContent = myAssetVal.toLocaleString();
    sellBtnVlue.value = '';
    saveData(); // 追加
  } else if (stockValueVal < sellValue) {
    alert('株数が足りません');
  } else if (sellValue <= 0) {
    alert('売却株数は0以上で入力してください');
  }
});
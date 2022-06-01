
const tipsApiForm = document.querySelector('#tips-api-button');
const cpTipsApi = document.querySelector('#currency-pair-tip');
const tipsApiResult = document.querySelector('#tips-api-result');

const url = "https://dev-guild-351320.rj.r.appspot.com";

tipsApiForm.addEventListener('click', event => {
    console.log('done')
    event.preventDefault();  
    fetch( url + `/tips/${cpTipsApi.value}`)
        .then( response => response.json())
        .then( data => {
            if(data.status === 'success') {
                tipsApiResult.innerHTML = `<li class="card">
                <div>
                  <h3 class="name">${data.currencyPair}</h3>
                  <h4>Bid</h4>
                  <ul class="macros">
                    <li class="carbs"><div>Quantity</div><div class="value">${data.data.bid.quantity}</div></li>
                    <li class="protein"><div>Rate</div><div class="value">${data.data.bid.rate}</div></li>
                  </ul>
                  <h4>Ask</h4>
                  <ul class="macros">
                    <li class="carbs"><div>Quantity</div><div class="value">${data.data.ask.quantity}</div></li>
                    <li class="protein"><div>Rate</div><div class="value">${data.data.ask.rate}</div></li>
                  </ul>
                </div>
                </li>`
            } else {
                tipsApiResult.innerHTML = `<li class="card">
                <div>
                  <h3 class="name">Error</h3>
                  <h4>${data.message}</h4>
                </div>
                </li>`
            }
        });
});


const calcApiForm = document.querySelector('#calc-api-button');
const cpCalcApi = document.querySelector('#currency-pair-calc');
const operation = document.querySelector('#operation');
const amount = document.querySelector('#amount');
const cap = document.querySelector('#cap');
const calcApiResult = document.querySelector('#tips-calc-result');

calcApiForm.addEventListener('click', event => {
    console.log('done')
    event.preventDefault();
    let capV = cap.value;
    if( capV === '0' ) {
        console.log('cap 0');
        capV = undefined;
    }
    fetch( url + "/calculate-price", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({currencyPair: cpCalcApi.value, operation: operation.value, amount: amount.value, cap: capV})
    })
        .then( response => response.json())
        .then( data => {
            console.log(data);
            if(data.status === 'success') {
                calcApiResult.innerHTML = `<li class="card">
                <div>
                  <h3 class="name">${cpCalcApi.value}</h3>
                  <h4>${operation.value}</h4>
                  <ul class="macros">
                    <li class="carbs"><div>Cap Reached: </div><div class="value">${data.capReached}</div></li>
                    <li class="protein"><div>Amount: </div><div class="value">${data.data.amount}</div></li>
                    <li class="fat"><div>Efective Price: </div><div class="value">${data.data.efectivePrice}</div></li>
                  </ul>
                </div>
                </li>`
            } else {
                calcApiResult.innerHTML = `<li class="card">
                <div>
                  <h3 class="name">Error</h3>
                  <h4>${data.message}</h4>
                </div>
                </li>`
            }
        });
});

const tipsWsForm = document.querySelector('#tips-ws-button');
const cpTipsWs = document.querySelector('#currency-pair-ws');
const tipsWsResult = document.querySelector('#tips-ws-result');

const socket = new WebSocket("wss://dev-guild-351320.rj.r.appspot.com");

socket.addEventListener('open', () => {
    console.log(`connected!`);
});


tipsWsForm.addEventListener('click', event => {
    event.preventDefault();  
    socket.send(JSON.stringify({method: "tips", currencyPair: cpTipsWs.value}));
});

const calcWsForm = document.querySelector('#calc-api-button-ws');
const cpCalcWs = document.querySelector('#currency-pair-calc-ws');
const operationWs = document.querySelector('#operation-ws');
const amountWs = document.querySelector('#amount-ws');
const capWs = document.querySelector('#cap-ws');
const calcWsResult = document.querySelector('#tips-calc-result-ws');

calcWsForm.addEventListener('click', event => {
    console.log('done')
    event.preventDefault();
    let capV = capWs.value;
    if( capV === '0' ) {
        console.log('cap 0');
        capV = undefined;
    }
    socket.send(JSON.stringify({method: "calculate-price", currencyPair: cpCalcWs.value, operation:operationWs.value, amount: amountWs.value, cap:capV}));
});

socket.addEventListener('message', event => {
    const dataj = JSON.parse(event.data);
    console.log(dataj)

    if(dataj.method === "tips-response") {
        if(dataj.data.status === 'success') {
            tipsWsResult.innerHTML = `<li class="card">
            <div>
              <h3 class="name">${dataj.data.currencyPair}</h3>
              <h4>Bid</h4>
              <ul class="macros">
                <li class="carbs"><div>Quantity</div><div class="value">${dataj.data.data.bid.quantity}</div></li>
                <li class="protein"><div>Rate</div><div class="value">${dataj.data.data.bid.rate}</div></li>
              </ul>
              <h4>Ask</h4>
              <ul class="macros">
                <li class="carbs"><div>Quantity</div><div class="value">${dataj.data.data.ask.quantity}</div></li>
                <li class="protein"><div>Rate</div><div class="value">${dataj.data.data.ask.rate}</div></li>
              </ul>
            </div>
            </li>`
        } else {
            tipsWsResult.innerHTML = `<li class="card">
            <div>
              <h3 class="name">Error</h3>
              <h4>${dataj.data.message}</h4>
            </div>
            </li>`
        }

    }
    if(dataj.method === "calculate-price-response") {
        if(dataj.data.status === 'success') {
            calcWsResult.innerHTML = `<li class="card">
            <div>
            <h3 class="name">${cpCalcWs.value}</h3>
            <h4>${operationWs.value}</h4>
            <ul class="macros">
                <li class="carbs"><div>Cap Reached: </div><div class="value">${dataj.data.capReached}</div></li>
                <li class="protein"><div>Amount: </div><div class="value">${dataj.data.data.amount}</div></li>
                <li class="fat"><div>Efective Price: </div><div class="value">${dataj.data.data.efectivePrice}</div></li>
            </ul>
            </div>
            </li>`
        } else {
            calcWsResult.innerHTML = `<li class="card">
            <div>
            <h3 class="name">Error</h3>
            <h4>${dataj.data.message}</h4>
            </div>
            </li>`
        }
    }
});

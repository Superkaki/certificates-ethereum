let wsUri = "ws://localhost:8080/";
let debug = true;

function init()
{
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) { onOpen(evt) };
  websocket.onclose = function(evt) { onClose(evt) };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt)
{

  writeToLog("Websocket opened!");
  //getLatestTokenStatus();
  //readMinutePrice("true");
  //startTimerDemo();
}

function onClose(evt)
{
  writeToLog("DISCONNECTED");
}

function onMessage(evt)
{
  if(evt && evt.data){
    let jsonData = JSON.parse(evt.data);
    writeToLog("3");
    if(jsonData && jsonData.params && jsonData.method){
      writeToLog("4");
      processMessageProtocol(jsonData);
    }
    writeToLog("5");
  }
  //websocket.close();
}

function onError(evt)
{
  writeToLog(evt.data);
}

function doSend(message)
{
  writeToLog("SENT: " + message);
  websocket.send(message);
}

function writeToLog(message)
{
  console.log("Message: "+message)
}

window.addEventListener("load", init, false);


///domain specific functions

function getLatestTokenStatus(){
  readChargingPointData();
  readCarData();
}

function registerNewCarArrival(data){
  let msg = {
    action: 'new_arrival',
    payload: data
  };
  let serializedData = JSON.stringify(msg);
  if(debug){
    alert(serializedData);
  }
  doSend(serializedData);
}

function startTimerDemo(){
  //start test timer por ping/pong
  setInterval(function(){
    let test = {
      action: 'ping',
      payload: undefined
    };
    doSend(JSON.stringify(test));
  }, 3000);
}

/*
//submit form listener
document.getElementById('submitcar').addEventListener('submit', function(evt){
    evt.preventDefault();
    console.log("manual request detected!")
    let matricula = $("#matricula")[0].value;
    let minutos = $("#minutos")[0].value;
    let token = $("#token")[0].value;
    let info = $("#info")[0];
    var selectedOption = info.options[info.selectedIndex].value;
    //read form data
    let data = {
      "matricula": matricula,
      "minutos": parseInt(minutos),
      "token": parseInt(token),
      "info": (selectedOption == 'true')
    }
    registerNewCarArrival(data);
})
*/


/*******************************************************************************/

//submit form listener
document.getElementById('checkCertificate').addEventListener('btnCheck', function(evt){
  evt.preventDefault();
  console.log("manual request detected!")
  let certHash = $("#certHash")[0].value;
  //read form data
  let data = {
    "certHash": certHash
  }
  checkCert(data);
})

//read latest minute price from the blockchain
function checkCert(data){
  //  let serializedData = JSON.stringify(msg);
  var serializedData = new JSON_RPC.Request("checkCert", data);
  console.log("Making certificate checking request: " + serializedData)
  doSend(serializedData);  
}


//submit form listener
document.getElementById('newCert').addEventListener('btnSend', function(evt){
  evt.preventDefault();
  console.log("manual request detected!")
  let to = $("#to")[0].value;
  let duration = $("#duration")[0].value;
  let certName = $("#certName")[0].value;
  //read form data
  let data = {
    "to": to,
    "duration": duration,
    "certName": certName
  }
  newCert(data);
})

//read latest minute price from the blockchain
function newCert(data){
  //  let serializedData = JSON.stringify(msg);
  var serializedData = new JSON_RPC.Request("newCert", data);
  console.log("Making new certificate request: " + serializedData)
  doSend(serializedData);  
}


/*******************************************************************************/


/*
//minutes value change listener
document.getElementById('minutos').addEventListener(
  'change',
  function(){
    readMinutePrice("true");
  },
  false
);

//tokens value change listener
document.getElementById('token').addEventListener(
  'change',
  function(){
    readMinutePrice("false");
  },
  false
);

//read latest charching point data from blockchain
function readChargingPointData(){
  let msg = {
    action: 'read_charging_point',
    payload: undefined
  };
  let serializedData = JSON.stringify(msg);
  doSend(serializedData);
}

//read latest car data from blockchain
function readCarData(){
  let msg = {
    action: 'read_car_data',
    payload: undefined
  };
  let serializedData = JSON.stringify(msg);
  doSend(serializedData);
}

//read latest minute price from the blockchain
function readMinutePrice(are_minutes_changed){
  let data = {
    "areMinutesChanged": (are_minutes_changed == 'true')
  }
  let msg = {
    action: 'read_minute_price',
    payload: data
  };
  let serializedData = JSON.stringify(msg);
  console.log("Making minute price request: "+serializedData)
  doSend(serializedData);
}

//message protocol handler
function processMessageProtocol(json){
  if(debug){
    console.log(json)
  }
  if(json){
    switch(json.method){
      case "charger_info_response":
        processChargerResponse(json.payload);
        break;
      case "car_data_response":
        processCarStatusResponse(json.payload);
        break;
      case "new_arrival_response":
        processArrivalResponse(json.payload);
        //update token values
        getLatestTokenStatus();
        break;
      case "new_reward_response":
        processRewardResponse(json.payload);
        //update token values
        getLatestTokenStatus();
        break;
      case "minute_price_response":
        if(json.payload.areMinutesChanged) {
          let minutes = document.getElementById('minutos').value;
          $("#token")[0].value = minutes * json.payload.minute_price;
          break;
        } else {
          let token = document.getElementById('token').value;
          $("#minutos")[0].value = token / json.payload.minute_price;
          break;
        }
      default:
        console.log(json.payload);
    }
  }
}

function processChargerResponse(json){
  if(json.address){
    $("#pointAddress")[0].innerHTML = json.address;
  }
  if(json.available_tokens){
    $("#pointTokens")[0].innerHTML = json.available_tokens+" TT"+"<small><br />Current Tokens</small>";
  }
}

function processCarStatusResponse(json){
  if(json.address){
    $("#carAddress")[0].innerHTML = json.address;
  }
  if(json.available_tokens){
    $("#carTokens")[0].innerHTML = json.available_tokens+" TT"+"<small><br />Current Tokens</small>";
  }
}

function processArrivalResponse(json){
  console.log("new car arrival processed!");
  addLogRow(json);
}

function processRewardResponse(json){
  console.log("new car rewarded!");
  addLogRow(json);
}

function addLogRow(data){
  if(data){
    //XSS vulnerable
    let rowdata = undefined;
    if(data.type=="recharge"){
      rowdata = "<tr style='color:red'>\
      <td>"+data.matricula+"</td>\
      <td>"+data.minutos+"</td>\
      <td>"+data.timestamp+"</td>\
      <td>"+data.token+"</td>\
      <td>"+data.type+"</td>\
      </tr>";
    }else{
      rowdata = "<tr style='color:green'>\
      <td>"+data.matricula+"</td>\
      <td>"+data.minutos+"</td>\
      <td>"+data.timestamp+"</td>\
      <td>"+data.reward+"</td>\
      <td>"+data.type+"</td>\
      </tr>";
    }

    rowdata = rowdata.replace("\
    ", "");

    let table = $("#logbody")[0];
    table.innerHTML = table.innerHTML+ rowdata;
  }
}

*/
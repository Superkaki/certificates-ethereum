let wsUri = "ws://localhost:8080/";
let debug = true;

function init() {
  websocket = new WebSocket(wsUri);
  websocket.onopen = function(evt) { onOpen(evt) };
  websocket.onclose = function(evt) { onClose(evt) };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {

  writeToLog("Websocket opened!");
  //startTimerDemo();
}

function onClose(evt) {
  writeToLog("DISCONNECTED");
}

function onMessage(evt) {
  if(evt && evt.data){
    let jsonData = JSON.parse(evt.data);
    if(jsonData && jsonData.result){
      console.log(jsonData.id);
      processMessageProtocol(jsonData);
    }
    else{
      console.log(jsonData.id + jsonData.result + jsonData.jsonrpc);
    }
  }
  //websocket.close();
}

function onError(evt) {
  writeToLog(evt.data);
}

/********************************************************************************************
Parse message yo json and send it
/********************************************************************************************/
function doSend(message) {
  let serializedData = JSON.stringify(message);
  writeToLog("REQUEST: " + serializedData);
  websocket.send(serializedData);
}

function writeToLog(message) {
  console.log("Message: "+message)
}

window.addEventListener("load", init, false);


///domain specific functions

function startTimerDemo(){
  //start test timer por ping/pong
  setInterval(function(){
    let test = {
      method: 'ping',
      action: undefined
    };
    doSend(test);
  }, 3000);
}


/********************************************************************************************
Listener for check certificate button
/********************************************************************************************/
document.getElementById('btnCheck').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("Certificate checking request detected!")
  let certHash = $("#certHash")[0].value;
  let address = $("#address")[0].value;
  //read form data
  let data = {
    "certHash": certHash,
    "address": address
  }
  checkCert(data);
})

/********************************************************************************************
Parse check certificate to json and send it
/********************************************************************************************/
function checkCert(data){
  let msg = {
    jsonrpc: '2.0',
    method: 'checkCert',
    params: data,
    id: '1'
  };
  console.log("Making certificate checking request")
  doSend(msg);  
}

/********************************************************************************************
Listener for new certificate button
/********************************************************************************************/
document.getElementById('btnSend').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("New cert request detected!")
  let owner = $("#owner")[0].value;
  let duration = $("#duration")[0].value;
  let certName = $("#certName")[0].value;
  let address = $("#address")[0].value;
  //read form data
  let data = {
    "owner": owner,
    "duration": duration,
    "certName": certName,
    "address": address
  }
  newCert(data);
})

/********************************************************************************************
Parse new certificate to json and send it
/********************************************************************************************/
function newCert(data){
  let msg = {
    jsonrpc: '2.0',
    method: 'newCert',
    params: data,
    id: '2'
  };
  console.log("Making new certificate request")
  doSend(msg);  
}

/********************************************************************************************
Listener for new entity to white list button
/********************************************************************************************/
document.getElementById('btnAdd').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("Add entity to white list request detected!")
  let whiteList = $("#whiteList")[0].value;
  let allowed = $("#allowed")[0].value;
  let address = $("#address")[0].value;
  //read form data
  let data = {
    "whiteList": whiteList,
    "allowed": allowed,
    "address": address
  }
  addEntityToWhiteList(data);
})

/********************************************************************************************
Parse new entity to white list to json and send it
/********************************************************************************************/
function addEntityToWhiteList(data){
  let msg = {
    jsonrpc: '2.0',
    method: 'setEntityToWhiteList',
    params: data,
    id: '3'
  };
  console.log("Making new entity to white list request" )
  doSend(msg);  
}

/********************************************************************************************/
/********************************************************************************************/
/********************************************************************************************/

//message protocol handler
function processMessageProtocol(json){
  if(debug){
    console.log(json)
  }
  if(json){
    switch(json.id){
      case "1":
        //processNewCertResponse(json.params);
        break;
      case "2":
        processNewCertResponse(json.params);
        break;
      case "3":
        //processNewCertResponse(json.params);
        break;
      /*
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
      */
      default:
        console.log(json.params);
    }
  }
}

/********************************************************************************************/
/********************************************************************************************/
/********************************************************************************************/

function processNewCertResponse() {
  console.log("New cert added to the list");
}

/*

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
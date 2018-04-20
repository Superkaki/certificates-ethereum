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
  writeToLog("REQUEST SENDED: " + serializedData);
  websocket.send(serializedData);
}

function writeToLog(message) {
  console.log(message)
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
  let certType = $("#certType")[0].value;
  let certName = $("#certName")[0].value;
  let address = $("#address")[0].value;
  //read form data
  let data = {
    "owner": owner,
    "duration": duration,
    "certType": certType,
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
/*****************************   Response message procesation   *****************************/
/********************************************************************************************/

//message protocol handler
function processMessageProtocol(json){
  if(debug){
    console.log("RESPONSE RECEIVED: " + JSON.stringify(json))
  }
  if(json){
    switch(json.id){
      case "1":
        processCheckCertResponse(json.result);
        break;
      case "2":
        processNewCertResponse(json.result);
        break;
      case "3":
        processEntityToWhiteListResponse(json.result);
        break;
      default:
        console.log(json.params);
    }
  }
}


/********************************************************************************************/
/***********************************   Response actions   ***********************************/
/********************************************************************************************/

function processCheckCertResponse(data) {
  console.log("Cert checked");

  //XSS vulnerable
  let iconVerify = undefined;
  let info = data.info;
  if(data.verification) {
    iconVerify = "<button class='btn btn-success btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_check'></i> Exist!\
                  </button>";
  } else {
    iconVerify = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> Does not exist!\
                  </button>";
  }

  iconVerify = iconVerify.replace("\
  ", "");

  let checking = $("#formCheck")[0];
  checking.innerHTML = checking.innerHTML + iconVerify;

  if(data){
    //XSS vulnerable
    let rowdata = undefined;
    rowdata = "<tr>\
    <td>"+data.creationDate+"</td>\
    <td>"+"Time"+"</td>\
    <td>"+data.certHash+"</td>\
    <td>"+data.sender+"</td>\
    </tr>";

    rowdata = rowdata.replace("\
    ", "");

    let table = $("#logHistory")[0];
    table.innerHTML = table.innerHTML + rowdata;
  }
}

function processNewCertResponse(data) {
  console.log("New cert added");

  /*
  if(data.certHash) {
    iconSended = "<button class='btn btn-success btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_check'></i> Created!\
                  </button>";
  } else {
    iconSended = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> Error creating certificate!\
                  </button>";
  }

  iconSended = iconSended.replace("\
  ", "");

  let checking = $("#formCreate")[0];
  checking.innerHTML = checking.innerHTML + iconSended;
*/

  if(data){
    //XSS vulnerable
    let rowdata = undefined;
    rowdata = "<tr>\
    <td id='toolong'>"+data.certHash+"</td>\
    <td id='toolong'>"+data.sender+"</td>\
    <td>"+data.certType+"</td>\
    <td>"+data.certName+"</td>\
    <td>"+data.creationDate+"</td>\
    <td>"+data.expirationDate+"</td>\
    </tr>";

    rowdata = rowdata.replace("\
    ", "");

    let table = $("#logCert")[0];
    table.innerHTML = table.innerHTML + rowdata;
  }
}

function processEntityToWhiteListResponse(data) {
  console.log("New entity allowed");
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
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
  getStatus();
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
Get status from a user
/********************************************************************************************/
function getStatus() {
  console.log("Loading user data");
  getCertificatesRecord();
  getCheckingHistory();
}

/********************************************************************************************
Get the record of certificates owned by a user
/********************************************************************************************/
function getCertificatesRecord() {
  let sender = $("#sender");
  let data = {
    "sender": sender.text()
  }
  let msg = {
    jsonrpc: '2.0',
    id: '0.0',
    method: 'getCertList',
    params: data
  };
  doSend(msg); 
}

/********************************************************************************************
Get the record of certificates owned by a user
/********************************************************************************************/
function getCheckingHistory() {
  let sender = $("#sender");
  let data = {
    "sender": sender.text()
  }
  let msg = {
    jsonrpc: '2.0',
    id: '0.0',
    method: 'getAccessLogList',
    params: data
  };
  doSend(msg); 
}

/********************************************************************************************
Listener for check certificate button
/********************************************************************************************/
document.getElementById('btnCheck').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("Certificate checking request detected!");
  let certHash = $("#certHash")[0].value;
  let sender = $("#sender");
  //read form data
  let data = {
    "certHash": certHash,
    "sender": sender.text()
  }
  checkCert(data);
})

/********************************************************************************************
Parse check certificate to json and send it
/********************************************************************************************/
function checkCert(data){
  let msg = {
    jsonrpc: '2.0',
    id: '1',
    method: 'checkCert',
    params: data
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
  let sender = $("#sender");
  //read form data
  let data = {
    "owner": owner,
    "duration": duration,
    "certType": certType,
    "certName": certName,
    "sender": sender.text()
  }
  newCert(data);
})

/********************************************************************************************
Parse new certificate to json and send it
/********************************************************************************************/
function newCert(data){
  let msg = {
    jsonrpc: '2.0',
    id: '2',
    method: 'newCert',
    params: data
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
  let sender = $("#sender");
  //read form data
  let data = {
    "whiteList": whiteList,
    "allowed": allowed,
    "sender": sender.text()
  }
  addEntityToWhiteList(data);
})

/********************************************************************************************
Parse new entity to white list to json and send it
/********************************************************************************************/
function addEntityToWhiteList(data){
  let msg = {
    jsonrpc: '2.0',
    id: '3',
    method: 'setEntityToWhiteList',
    params: data,
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
      case "0.1":
        processCertificatesRecord(json.result);
        break;
      case "0.2":
        processAccessLogRecord(json.result);
        break; 
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

function processCertificatesRecord(data) {
  if(data){
    //XSS vulnerable
    let rowdata = undefined;
    if(data.isStilValid) {
      iconValid = "<button class='btn btn-success btn-icon btn-round'>\
                      <i class='now-ui-icons ui-1_check'></i>\
                  </button>";
    } else {
      iconValid = "<button class='btn btn-danger btn-icon btn-round'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i>\
                  </button>";
    }
    rowdata = "<tr>\
    <td id='toolong'>"+data.certHash+"</td>\
    <td id='toolong'>"+data.issuer+"</td>\
    <td>"+data.certType+"</td>\
    <td>"+data.certName+"</td>\
    <td>"+epochToTime(data.creationDate)+"</td>\
    <td>"+epochToTime(data.expirationDate)+"</td>\
    <td>"+iconValid+"</td>\
    </tr>";

    rowdata = rowdata.replace("\
    ", "");

    let table = $("#logCert")[0];
    table.innerHTML = table.innerHTML + rowdata;
  }
}

function processAccessLogRecord(data) {
  if(data){
    //XSS vulnerable
    let rowdata = undefined;
    if(data.hadSuccess) {
      iconHadSuccess = "<button class='btn btn-success btn-icon btn-round'>\
                      <i class='now-ui-icons ui-1_check'></i>\
                  </button>";
    } else {
      iconHadSuccess = "<button class='btn btn-danger btn-icon btn-round'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i>\
                  </button>";
    }
    rowdata = "<tr>\
    <td>"+epochDate(data.creationDate)+"</td>\
    <td>"+epochTime(data.creationDate)+"</td>\
    <td id='toolong'>"+data.user+"</td>\
    <td id='toolong'>"+data.certHash+"</td>\
    </tr>";

    rowdata = rowdata.replace("\
    ", "");

    let table = $("#logCert")[0];
    table.innerHTML = table.innerHTML + rowdata;
  }
}


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
    <td>"+epochDate(data.creationDate)+"</td>\
    <td>"+epochTime(data.creationDate)+"</td>\
    <td id='toolong'>"+data.certHash+"</td>\
    <td id='toolong'>"+data.sender+"</td>\
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
    iconValid = "<button class='btn btn-success btn-icon btn-round'>\
        <i class='now-ui-icons ui-1_check'></i>\
    </button>";

    rowdata = "<tr>\
    <td id='toolong'>"+data.certHash+"</td>\
    <td id='toolong'>"+data.sender+"</td>\
    <td>"+data.certType+"</td>\
    <td>"+data.certName+"</td>\
    <td>"+epochToTime(data.creationDate)+"</td>\
    <td>"+epochToTime(data.expirationDate)+"</td>\
    <td>"+iconValid+"</td>\
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


/********************************************************************************************/
/***********************************   Other functions   ************************************/
/********************************************************************************************/

function epochToTime(epoch) {
  var myDate = new Date( epoch *1000);
  return(myDate.toLocaleString());
}

function epochDate(epoch) {
  var myDate = new Date( epoch *1000);
  return myDate.toDateString();
}

function epochTime(epoch) {
  var myDate = new Date( 1524555566 *1000);
  return myDate.toLocaleTimeString();
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

*/
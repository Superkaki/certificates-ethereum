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
    if(jsonData){
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
  writeToLog("----> REQUEST SENDED: " + serializedData);
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
Listener for testing button
/********************************************************************************************/
document.getElementById('btnTest').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("Testing network");

  console.log("###############  Runing test  ###############");

  let data = {
    "owner": "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
    "duration": 300,
    "certType": "Titulo marítimo",
    "certName": "Capitán",
    "sender": "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef"
  }
  newCert(data);
  
  data = {
    "owner": "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
    "duration": 300,
    "certType": "Titulo nobiliario",
    "certName": "Barón Rojo",
    "sender": "0xf17f52151EbEF6C7334FAD080c5704D77216b732"
  }
  newCert(data);

  data = {
    "owner": "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
    "duration": 300,
    "certType": "Convenio Prácticas",
    "certName": "Tecnalia Junio2017",
    "sender": "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef"
  }
  newCert(data);

  console.log("TEST OK");
})

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
    id: '0.1',
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
    id: '0.2',
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
  let checkCertHash = $("#checkCertHash")[0].value;
  let sender = $("#sender");
  //read form data
  let data = {
    "certHash": checkCertHash,
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
Listener for new owner button
/********************************************************************************************/
document.getElementById('btnAddOwner').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("Add new owner request detected!")
  let manageCertHash = $("#manageCertHash")[0].value;
  let address = $("#address")[0].value;
  let sender = $("#sender");
  //read form data
  let data = {
    "certHash": manageCertHash,
    "newOwner": address,
    "sender": sender.text()
  }
  addNewOwner(data);
})

/********************************************************************************************
Parse new owner to json and send it
/********************************************************************************************/
function addNewOwner(data){
  let msg = {
    jsonrpc: '2.0',
    id: '3',
    method: 'setNewOwner',
    params: data,
  };
  console.log("Making new owner request" )
  doSend(msg);  
}

/********************************************************************************************
Listener for new entity to white list button
/********************************************************************************************/
document.getElementById('btnAllow').addEventListener('click', function(evt){
  evt.preventDefault();
  console.log("Add entity to white list request detected!")
  let manageCertHash = $("#manageCertHash")[0].value;
  let address = $("#address")[0].value;
  let sender = $("#sender");
  //read form data
  let data = {
    "certHash": manageCertHash,
    "address": address,
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
    id: '4',
    method: 'setEntityToWhiteList',
    params: data,
  };
  console.log("Making new entity to white list request" )
  doSend(msg);  
}

///********************************************************************************************
//Listener for remove certificate button
///********************************************************************************************/
//document.getElementById('btnRemove').addEventListener('click', function(evt){
//  evt.preventDefault();
//  console.log("Remove certificate request detected!")
//  let certHash = $("#toolong")[0].value;
//  //read form data
//  let data = {
//    "certHash": certHash
//  }
//  removeCertificate(data);
//})
//
///********************************************************************************************
//Parse remove certificate to json and send it
///********************************************************************************************/
//function removeCertificate(data){
//  let msg = {
//    jsonrpc: '2.0',
//    id: '5',
//    method: 'removeCertificate',
//    params: data,
//  };
//  console.log("Making remove certificate request" )
//  doSend(msg);  
//}


/********************************************************************************************/
/*****************************   Response message procesation   *****************************/
/********************************************************************************************/

//message protocol handler
function processMessageProtocol(json){
  if(debug){
    console.log("<---- RESPONSE RECEIVED: " + JSON.stringify(json))
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
        processCheckCertResponse(json);
        break;
      case "2":
        processNewCertResponse(json);
        break;
      case "3":
        processNewOwnerResponse(json);
        break;
      case "4":
        processEntityToWhiteListResponse(json);
        break;
      case "5":
        processRemoveCertificateResponse(json.result);
        break;
      default:
        console.log(json.params);
    }
  }
}


/********************************************************************************************/
/***********************************   Response actions   ***********************************/
/********************************************************************************************/

/********************************************************************************************
Show all the certificates from a user
/********************************************************************************************/
function processCertificatesRecord(data) {
  if(data){
    addNewCertRow(data);
  }
}

/********************************************************************************************
Show all the checkings from a user's certificates
/********************************************************************************************/
function processAccessLogRecord(data) {
  if(data){
    addAccessLogRow(data);
  }
}

/********************************************************************************************
Show success icon
Insert a new certificate checking into the record
/********************************************************************************************/
function processCheckCertResponse(json) {
  console.log("Cert checked");
  
  if(json.result){
    let data = json.result;
    addAccessLogRow(data);

    let iconVerify = undefined;
    if(data.isStilValid) {
      iconVerify = "<button class='btn btn-success btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_check'></i> Valid certificate\
                  </button>";
    } else {
      iconVerify = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> Expired certificate\
                  </button>";
    }

    rowdata = "<h6 class='title'>Creation Date: " + epochToDateTime(data.creationDate) + "</h6>\
    <h6 class='title'>Issuer: " + data.issuer + "</h6>\
    <h6 class='title'>Type: " + data.certType + "</h6>\
    <h6 class='title'>Title: " + data.certName + "</h6>\
    <h6 class='title'>" + iconVerify + "</h6>";
    rowdata = rowdata.replace("", "");
    let info = $("#certInfo")[0];
    info.innerHTML = rowdata;
  
  } else {
    let data = json.error;
    iconVerify = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> "+data.message+"\
                  </button>";
    iconVerify = iconVerify.replace("", "");
    let checking = $("#certInfo")[0];
    checking.innerHTML = iconVerify;
  }
}

/********************************************************************************************
Show success icon
Insert a new certificate creation into the record
/********************************************************************************************/
function processNewCertResponse(json) {
  if(json.result) {
    let data = json.result;
    console.log("New cert added");

    if(data.certHash) {
      iconSended = "<button class='btn btn-success btn-round' type='button'>\
                        <i class='now-ui-icons ui-1_check'></i> Created!\
                    </button>";
    } else {
      iconSended = "<button class='btn btn-danger btn-round' type='button'>\
                        <i class='now-ui-icons ui-1_simple-remove'></i> Error creating certificate!\
                    </button>";
    }

    if(data){
      addNewCertRow(data);
    }
  } else {
    let data = json.error;
    console.log("Error: " + data.message);
    iconSended = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> "+data.message+"\
                  </button>";
  }

  iconSended = iconSended.replace("", "");
  let creating = $("#formSend")[0];
  creating.innerHTML = iconSended;
}

/********************************************************************************************
Show success icon
/********************************************************************************************/
function processNewOwnerResponse(json) {
  if(json.result) {
    console.log("New owner added");
    iconAdded = "<button class='btn btn-success btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_check'></i> Added!\
                </button>";
  } else {
    let data = json.error;
    console.log("Error: " + data.message);
    iconAdded = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> "+data.message+"\
                </button>";
  }
  iconAdded = iconAdded.replace("", "");
  let creating = $("#formAdd")[0];
  creating.innerHTML = iconAdded;
}

/********************************************************************************************
Show success icon
/********************************************************************************************/
function processEntityToWhiteListResponse(json) {
  if(json.result) {
    console.log("New entity allowed");

    iconAdded = "<button class='btn btn-success btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_check'></i> Allowed!\
                </button>";
  } else {
    let data = json.error;
    console.log("Error: " + data.message);
    iconAdded = "<button class='btn btn-danger btn-round' type='button'>\
                      <i class='now-ui-icons ui-1_simple-remove'></i> "+data.message+"\
                </button>";
  }
  iconAdded = iconAdded.replace("", "");
  let creating = $("#formAdd")[0];
  creating.innerHTML = iconAdded;
}

/********************************************************************************************
Show success icon
/********************************************************************************************/
function processRemoveCertificateResponse(data) {
  console.log("Certificate removed");

  iconVerify = "<button class='btn btn-danger btn-round' type='button'>\
                  <i class='now-ui-icons ui-1_simple-remove'></i>\
              </button>";
  iconVerify = iconVerify.replace("\
  ", "");
  let creating = $("#iconValid")[0];
  creating.innerHTML = iconVerify;

  iconRemove = "<button id='btnRemove' class='btn btn-danger btn-round'>Removed!</button>";
  iconRemove = iconRemove.replace("", "");
  let creating = $("#iconRemove")[0];
  creating.innerHTML = iconRemove;
}


/********************************************************************************************/
/***********************************   Other functions   ************************************/
/********************************************************************************************/

function epochToDateTime(epoch) {
  var myDate = new Date( epoch *1000);
  return(myDate.toLocaleString());
}

function epochDate(epoch) {
  var myDate = new Date( epoch *1000);
  return myDate.toDateString();
}

function epochTime(epoch) {
  var myDate = new Date( epoch *1000);
  return myDate.toLocaleTimeString();
}

/********************************************************************************************
Add new certificate to the certificates record
/********************************************************************************************/
function addNewCertRow(data) {
  //XSS vulnerable
  let rowdata = undefined;
  if(data.isStilValid) {
    iconValid = "<button class='btn btn-success btn-icon btn-round'>\
                    <i class='now-ui-icons ui-1_check'></i>\
                </button>";
    iconRemove = "<button id='btnRemove' class='btn btn-warning btn-round'>Remove</button>";
  } else {
    iconValid = "<button class='btn btn-danger btn-icon btn-round'>\
                    <i class='now-ui-icons ui-1_simple-remove'></i>\
                </button>";
    iconRemove = "";
  }

  rowdata = "<tr>\
  <td id='toolong'>"+data.certHash+"</td>\
  <td id='toolong'>"+data.issuer+"</td>\
  <td>"+data.certType+"</td>\
  <td>"+data.certName+"</td>\
  <td>"+epochToDateTime(data.creationDate)+"</td>\
  <td>"+epochToDateTime(data.expirationDate)+"</td>\
  <td>"+iconValid+"</td>\
  </tr>";

  rowdata = rowdata.replace("", "");
  let table = $("#logCert")[0];
  table.innerHTML = rowdata + table.innerHTML;
}

/********************************************************************************************
Add new access log to the history record
/********************************************************************************************/
function addAccessLogRow(data) {
  //XSS vulnerable
  let rowdata = undefined;
  rowdata = "<tr>\
  <td>"+epochDate(data.creationDate)+"</td>\
  <td>"+epochTime(data.creationDate)+"</td>\
  <td id='toolong'>"+data.certHash+"</td>\
  <td id='toolong'>"+data.user+"</td>\
  </tr>";
  rowdata = rowdata.replace("", "");
  let table = $("#logHistory")[0];
  table.innerHTML = rowdata + table.innerHTML;
}
'use strict'

const proto = require('./protocol');

const gethURL = "http://172.17.0.3:8546";

//BEGIN: prepare tools needed to connect to ethereum 
const Web3 = require('web3');
const Accounts = require('web3-eth-accounts');
const contract = require("truffle-contract");

var provider = new Web3.providers.HttpProvider(gethURL);
const web3 = new Web3(provider);
const accounts = new Accounts(gethURL);

let inakiAddress = ("0xa416ea7ab365c38e5c39b6f06ae779bebe918328");
let jackAddress = ("0x4eab0f78821612c0528f29fe1193c5d825616a74");
let deustoAddress = ("0x86b53fd08baef3202ad2c4cb0b5d04384d2c8850");
let tecnaliaAddress = ("0x7afc3bb694c30717c6999428cf38734cf39ebeff");

console.log("Running web3 version: "+Web3.version);
console.log("Active  Web3 modules: "+JSON.stringify(Web3.modules));

const personal = web3.eth.personal;
const toHex = web3.utils.utf8ToHex;
const toStr = web3.utils.hexToString;

const abi = [{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"}],"name":"removeCertificate","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCreator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"accessLogs","outputs":[{"name":"date","type":"uint256"},{"name":"user","type":"address"},{"name":"certificate","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"addOwner","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"setNewOwner","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"certUnique","type":"bytes32"}],"name":"getCertByHash","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"}],"name":"insertHistory","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"certs","outputs":[{"name":"issuer","type":"address"},{"name":"certName","type":"string"},{"name":"certType","type":"string"},{"name":"creationDate","type":"uint256"},{"name":"expirationDate","type":"uint256"},{"name":"isStilValid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_add","type":"address"},{"name":"_userName","type":"bytes15"},{"name":"_userNid","type":"bytes9"}],"name":"setUser","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"ConstructorCertToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"nounce","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"add","type":"address"}],"name":"getUserByAddress","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"},{"name":"_newEntity","type":"address"}],"name":"setEntityToWhiteList","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"add","type":"address"}],"name":"getAccessLogList","outputs":[{"name":"accessLogList","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"users","outputs":[{"name":"name","type":"bytes15"},{"name":"nid","type":"bytes9"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"certUnique","type":"bytes32"}],"name":"checkCert","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"accessLogUnique","type":"bytes32"}],"name":"getAccessLogByHash","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"}],"name":"checkExpiration","outputs":[{"name":"isValid","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"add","type":"address"}],"name":"getCertList","outputs":[{"name":"ownCertsList","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_certType","type":"string"},{"name":"_certName","type":"string"},{"name":"_duration","type":"uint256"}],"name":"newCert","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"certUnique","type":"bytes32"}],"name":"isSenderAllowed","outputs":[{"name":"isAllowed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"certUnique","type":"bytes32"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"certType","type":"string"},{"indexed":false,"name":"certName","type":"string"},{"indexed":false,"name":"creationDate","type":"uint256"},{"indexed":false,"name":"expirationDate","type":"uint256"}],"name":"newCertCreated","type":"event"}];
const ContractAddress = "0xc676dd57e4fb4c800188c353c79f84bdecf1b191";
var myContract = new web3.eth.Contract(abi, ContractAddress, {
	from: deustoAddress, // default from address
	gasPrice: '3000000' // default gas price in wei
});

const CertificateContract = contract(
	require("../../token/build/contracts/CertToken.json")
);

console.log("Provider: "+JSON.stringify(provider));
console.log("Current provider: "+Web3.currentProvider);
// Remember to set the Web3 provider (see above).
CertificateContract.setProvider(provider);

//BEGIN workaround to fix:  Cannot read property 'apply' of undefined
CertificateContract.currentProvider.sendAsync = function () {
    return CertificateContract.currentProvider.send.apply(CertificateContract.currentProvider, arguments);
};
//END workaround

let tokenManager;

console.log("Deploying contract...");

//END: prepare tools needed to connect to ethereum

class CertificateProtocol extends proto.Protocol {

	constructor() {
		super();
		this.tokenManager = undefined;
		//userCreation();
		//test();
	}

    parse(wsClient, jsonData){
		
		this._client = wsClient;

    	if(!this.isValidMessage(jsonData)){
			let data = jsonData.params;
			let response = this.responseHolder(data.id);
		    response.error = {
				code: "32600",
				message: "Invalid message"
			}
			this.sendResponse(response);
			return;
		}
		
    	switch(jsonData.method){
            case "getCertList":{
				let that = this;
				let data = jsonData.params;
				let transactionObject = {from: data.sender, gas: 3000000}
			
				myContract.methods.getCertList(data.sender).call(transactionObject).then(function(rslt) {
					printResult("getCertList result",rslt);

					if(rslt != undefined){
						for (var i = 0; i < rslt.length; i++) {
							myContract.methods.checkExpiration(rslt[i]).send(transactionObject);
							myContract.methods.getCertByHash(rslt[i]).call(transactionObject).then(function(certInfo) {
								let response = that.responseHolder(jsonData.id);
								response.result = {
									certHash: certInfo[0],
									issuer: certInfo[1], 
									certType: toStr(certInfo[2]), 
									certName: toStr(certInfo[3]),
									creationDate: certInfo[4],
									expirationDate: certInfo[5],
									isStilValid: certInfo[6]
								}
								that.sendResponse(response);
							}).catch((err) => {
								console.log("Something happens getting a certificate: " + err);
								//TODO: that.sendResponse(error)
							});
						}
					}
					else{
						console.log("Balance error: "+rslt);
					}
				}).catch((err) => {
					console.log("Something happens getting certificate list: " + err);
					//TODO: that.sendResponse(error)
				});				
    			break
			}

			case "getAccessLogList":{
				let that = this;
				let data = jsonData.params;
				let transactionObject = {from: data.sender, gas: 3000000}
				
				myContract.methods.getAccessLogList(data.sender).call(transactionObject).then(function(rslt) {
					printResult("getAccessLogList result",rslt);
					if(rslt != undefined){
						for (var i = 0; i < rslt.length; i++) {
							printResult("··········",rslt[i]);
							myContract.methods.getAccessLogByHash(rslt[i]).call(transactionObject).then(function(accessLogInfo) {
								printResult("getAccessLogByHash result of "+rslt[i],JSON.stringify(accessLogInfo));
								let response = that.responseHolder(jsonData.id);
								response.result = {
									accessLogHash: accessLogInfo[0],
									creationDate: accessLogInfo[1],
									user: accessLogInfo[2],
									certHash: accessLogInfo[3],
									hadSuccess: true
								}
								that.sendResponse(response);
							}).catch((err) => {
								console.log("Something happens getting a certificate access log: " + err);
								//TODO: that.sendResponse(error)
							});
						}
					}
					else{
						console.log("Balance error: "+rslt)
					}
				}).catch((err) => {
					console.log("Something happens getting certificate list: " + err);
					//TODO: that.sendResponse(error)
				});				
    			break
			}

			case "setUser":{
				let that = this;
				let data = jsonData.params;
				let transactionObject = {from: data.sender, gas: 3000000}

				myContract.methods.setUser(data.sender, toHex(data.userName), toHex(data.userNID)).send(transactionObject)
				.on('receipt', function(receipt){
					printResult("setUser block",JSON.stringify(receipt));
					if(receipt != undefined){
						let response = that.responseHolder(jsonData.id);
		    			response.result = {
							block: receipt						
						}
						console.log("Making new user response")
						that.sendResponse(response);
					}
				}).catch((err) => {
					let response = that.errorResponse(jsonData.id);
					let msg = "Something happens creating new user";
					response.error = {
						code: "400",
						message: msg
					}
					that.sendResponse(response);
					console.log(msg + ": " + err);
				});				
    			break
			}

            case "checkCert":{
				let that = this;
				let data = jsonData.params;
				let transactionObject = {from: data.sender, gas: 3000000}

				myContract.methods.checkExpiration(data.certHash).send(transactionObject)
				.on('receipt', function(receipt){
					printResult("checkExpiration block",JSON.stringify(receipt));
				});
				myContract.methods.isSenderAllowed(data.certHash).call(transactionObject).then(function(rslt) {
					printResult("isSenderAllowed result",rslt);
					if (rslt) {
						myContract.methods.insertHistory(data.certHash).send(transactionObject)
						.on('receipt', function(receipt){
							printResult("insertHistory block",JSON.stringify(receipt));
						});
						myContract.methods.getCertByHash(data.certHash).call(transactionObject).then(function(certInfo) {
							printResult("getCertByHash result",JSON.stringify(certInfo));
							let response = that.responseHolder(jsonData.id)
							response.result = {
								certHash: certInfo[0],
								issuer: certInfo[1], 
								certType: toStr(certInfo[2]), 
								certName: toStr(certInfo[3]),
								creationDate: certInfo[4],
								user: data.sender,
								isStilValid: certInfo[6]
							}
							that.sendResponse(response);
						});
					} else {
						let response = that.errorResponse(jsonData.id);
						response.error = {
							code: "403",
							message: "Permission denied or does not exist"
						}
						that.sendResponse(response);
					}
				}).catch((err) => {
					console.log("Something happens checking certificate: " + err);
					//TODO: that.sendResponse(error)
				});				
    			break
			}

			case "newCert":{
				let that = this;
				let data = jsonData.params;
				let transactionObject = {from: data.sender, gas: 3000000}

				myContract.methods.newCert(data.owner, toHex(data.certType), toHex(data.certName), data.duration).send(transactionObject)
				.on('receipt', function(receipt){
					printResult("newCert block",JSON.stringify(receipt));
			// TODO	myContract.methods.getLastBlock(data.certHash).call(transactionObject).then(function(certInfo) {
			//			printResult("getLastBlock result",certInfo);
			//			if(certInfo != undefined){
			//				let response = that.responseHolder(jsonData.id);
			//				response.result = {
			//					certHash: certInfo[0],
			//					issuer: certInfo[1], 
			//					certType: toStr(certInfo[2]), 
			//					certName: toStr(certInfo[3]),
			//					creationDate: certInfo[4],
			//					user: data.sender,
			//					isStilValid: certInfo[6]
			//				}
			//				that.sendResponse(response);
			//			} else {
			//				console.log("Balance error: "+rslt)
			//			}
			//		});
				}).catch((err) => {
					console.log("Something happens creating new certificate: " + err);
					let response = that.errorResponse(jsonData.id);
					response.error = {
						code: "403",
						message: "Permission denied, can not autosend a certificate"
					}
					that.sendResponse(response);
				});	
    			break
			}

			case "setNewOwner":{
				let that = this;
				let data = jsonData.params;
    			let transactionObject = {from: data.sender, gas: 3000000}

				myContract.methods.setNewOwner(data.certHash, data.newOwner).send(transactionObject)
				.on('receipt', function(receipt){
					printResult("setNewOwner block",JSON.stringify(receipt));
					if(receipt != undefined){
						let response = that.responseHolder(jsonData.id);
		    			response.result = {
							block: receipt						
						}
						console.log("Making new owner response")
						that.sendResponse(response);
					}
					else{
						console.log("Balance error: "+receipt)
					}
				}).catch((err) => {
					console.log("Something happens adding new owner to certificate: " + err);
					let response = that.errorResponse(jsonData.id);
					response.error = {
						code: "403",
						message: "Permission denied, you are not the issuer"
					}
					that.sendResponse(response);
				});				
    			break
			}

			case "setEntityToWhiteList":{
				let that = this;
				let data = jsonData.params;
    			let transactionObject = {from: data.sender, gas: 3000000}

				myContract.methods.setEntityToWhiteList(data.certHash, data.address).send(transactionObject)
				.on('receipt', function(receipt){
					printResult("setEntityToWhiteList block",JSON.stringify(receipt));
					if(receipt != undefined){
						let response = that.responseHolder(jsonData.id);
		    			response.result = {
							block: receipt						
						}
						console.log("Making entity to white list response")
						that.sendResponse(response);
					}
					else{
						console.log("Balance error: "+receipt)
					}
				}).catch((err) => {
					console.log("Something happens adding new entity to white list: " + err);
					let response = that.errorResponse(jsonData.id);
					response.error = {
						code: "403",
						message: "Permission denied, you do not own that certificate"
					}
					that.sendResponse(response);
					});				
    			break
			}

			case "removeCertificate":{
				let that = this;
				let data = jsonData.params;
    			let transactionObject = {from: data.sender, gas: 3000000}

				myContract.methods.removeCertificate(data.certHash).send(transactionObject)
				.on('receipt', function(receipt){
					printResult("removeCertificate block",JSON.stringify(receipt));
					if(receipt != undefined){
						let response = that.responseHolder(jsonData.id);
		    			response.result = {
							block: receipt						
						}
						console.log("Making entity to white list response")
						that.sendResponse(response);
					}
					else{
						console.log("Balance error: "+receipt)
					}
				}).catch((err) => {
					console.log("Something happens removing certificate: " + err);
					let response = that.errorResponse(jsonData.id);
					response.error = {
						code: "403",
						message: "Permission denied"
					}
					that.sendResponse(response);
				});				
    			break
			}

    		default:{
    			wsClient.send("Hello world");
    		}
		}		
	}
}

function printResult(param,rslt) {
	console.log("");
	console.log("###############  Request result  ###############");	
	if (param != "" && rslt != "") {
		console.log(param+":\n"+rslt);
	} else if (param == "" && rslt != "") {
		console.log(rslt);
	} else {
		console.log("There isn't results to the request");		
	}
}

function userCreation() {

	console.log("###############  Generating users  ###############");
	var ok = myContract.methods.setUser(inakiAddress, toHex('Inaki Seco'), toHex('22222222I')).send({from: inakiAddress, gas: 3000000})
	.on('transactionHash', function(hash){
		console.log("setUser hash: "+hash);
	}).then(myContract.methods.setUser(jackAddress, toHex('Jack Sparrow'), toHex('66666666J')).send({from: jackAddress, gas: 3000000})
	.on('transactionHash', function(hash){
		console.log("setUser hash: "+hash);
	}).then(myContract.methods.setUser(deustoAddress, toHex('Univeristy of Deusto'), toHex('77777777D')).send({from: deustoAddress, gas: 3000000})
	.on('transactionHash', function(hash){
		console.log("setUser hash: "+hash);
	}).then(myContract.methods.setUser(tecnaliaAddress, toHex('Tecnalia Research Innovation'), toHex('11111111T')).send({from: tecnaliaAddress, gas: 3000000})
	.on('transactionHash', function(hash){
		console.log("setUser hash: "+hash);
	}))));

	myContract.methods.getUserByAddress(inakiAddress).call({from:jackAddress})
	.then(function(result){
	printResult(inakiAddress+" information",toStr(result[0])+", "+toStr(result[1]));
	});
}

function test() {

	myContract.methods.getCreator().call({from:jackAddress})
		.then(function(result){
		console.log("Contract ceator: "+result);
	});

	myContract.methods.getMyAddress().call({from:jackAddress})
		.then(function(result){
		console.log("My address: "+result);
	});
	
	console.log("###############  Creating new certificate  ###############");
	myContract.methods.newCert(jackAddress, toHex('Título de grado'), toHex('Ingeniería de Telecomunicaciones'), 1200).send({from: deustoAddress, gas: 3000000})
	.on('transactionHash', function(hash){
		console.log("newCert hash: "+hash);
	})
	.on('receipt', function(receipt){
		myContract.methods.getCertList(jackAddress).call({from:inakiAddress})
			.then(function(result){
			console.log("CertList: "+result);
		});
	});

}


exports.CertificateProtocol = CertificateProtocol;
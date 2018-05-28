'use strict'

const proto = require('./protocol');

//const gethURL = "http://127.0.0.1:9545";
const gethURL = "http://172.17.0.2:8546";

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

const eth = web3.eth;
const personal = eth.personal;


const abi = [{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"}],"name":"removeCertificate","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCreator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"accessLogs","outputs":[{"name":"date","type":"uint256"},{"name":"user","type":"address"},{"name":"certificate","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"addOwner","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"setNewOwner","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"certUnique","type":"bytes32"}],"name":"getCertByHash","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"}],"name":"insertHistory","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"certs","outputs":[{"name":"issuer","type":"address"},{"name":"certName","type":"string"},{"name":"certType","type":"string"},{"name":"creationDate","type":"uint256"},{"name":"expirationDate","type":"uint256"},{"name":"isStilValid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_add","type":"address"},{"name":"_userName","type":"bytes15"},{"name":"_userNid","type":"bytes9"}],"name":"setUser","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"ConstructorCertToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"nounce","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"add","type":"address"}],"name":"getUserByAddress","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"},{"name":"_newEntity","type":"address"}],"name":"setEntityToWhiteList","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"add","type":"address"}],"name":"getAccessLogList","outputs":[{"name":"accessLogList","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"users","outputs":[{"name":"name","type":"bytes15"},{"name":"nid","type":"bytes9"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"certUnique","type":"bytes32"}],"name":"checkCert","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"accessLogUnique","type":"bytes32"}],"name":"getAccessLogByHash","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_certUnique","type":"bytes32"}],"name":"checkExpiration","outputs":[{"name":"isValid","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"add","type":"address"}],"name":"getCertList","outputs":[{"name":"ownCertsList","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_certType","type":"string"},{"name":"_certName","type":"string"},{"name":"_duration","type":"uint256"}],"name":"newCert","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"certUnique","type":"bytes32"}],"name":"isSenderAllowed","outputs":[{"name":"isAllowed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"certUnique","type":"bytes32"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"certType","type":"string"},{"indexed":false,"name":"certName","type":"string"},{"indexed":false,"name":"creationDate","type":"uint256"},{"indexed":false,"name":"expirationDate","type":"uint256"}],"name":"newCertCreated","type":"event"}];
const myContract = new web3.eth.Contract(abi, '0xc676dd57e4fb4c800188c353c79f84bdecf1b191');
const transactionObject = {
	from: jackAddress,
	gas: 3000000
};

userCreationTest();

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
		this.deploy();
		this.tokenManager = undefined;
    }

    deploy(){
    	let that = this;
//		console.log("Deploy CertificateContract!");
//		CertificateContract.deployed().then(function(instance) {
//		CertificateContract.
//			console.log("Contract deployed!");
//			that.tokenManager = instance;
//			console.log("Creating instance")
//			console.log("###############  Generating users  ###############");
//			return that.tokenManager.setUser(inakiAddress, "Inaki Seco", "22222222A", {from: inakiAddress, gas:3000000});
//		}).then(function(result) {
//			console.log("User Inaki creation block");
//			console.log(JSON.stringify(result));
//	    	return that.tokenManager.setUser(jackAddress, "Jack Sparrow", "66666666B", {from: jackAddress, gas:3000000});
//	    }).then(function(result) {
//			console.log("User Jack creation block");
//			console.log(JSON.stringify(result));
//			return that.tokenManager.setUser(deustoAddress, "Univeristy of Deusto", "77777777D", {from: deustoAddress, gas:3000000});
//	    }).then(function(result) {
//			console.log("Entity Deusto creation block");
//			console.log(JSON.stringify(result));
//			return that.tokenManager.setUser(tecnaliaAddress, "Tecnalia Research Innovation", "11111111T", {from: tecnaliaAddress, gas:3000000});
//	    }).then(function(result) {
//			console.log("Entity Tecnalia creation block");
//			console.log(JSON.stringify(result));
//		}).catch(function(err) {
//		  	console.log("FULL ERROR! " + err);       	  // Easily catch all errors along the whole execution.
//		});
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
				console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.getCertList(data.sender, {from: data.sender, gas:3000000}).then(function(rslt) {
					printResult(rslt);
					if(rslt != undefined){
						for (var i = 0; i < rslt.length; i++) {
							that.tokenManager.checkExpiration(rslt[i], {from: data.sender, gas:3000000});
							that.tokenManager.getCertByHash(rslt[i], {from: data.sender, gas:3000000}).then(function(certInfo) {
								let response = that.responseHolder(jsonData.id);
								response.result = {
									certHash: certInfo[0],
									issuer: certInfo[1], 
									certType: certInfo[2], 
									certName: certInfo[3],
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
																																				
						//let certList = that.tokenManager.certList({}, {fromBlock: 'latest', toBlock: 'latest'})
						//certList.get((error, logs) => {
						//	logs.forEach(log => {
						//		response.result = {
						//			certificateList: log.args.ownCerts
						//		}
						//		that.sendResponse(response);
						//	})
						//})
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

			case "getAccessLogList":{
				let that = this;
				let data = jsonData.params;
				console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.getAccessLogList(data.sender, {from: data.sender, gas:3000000}).then(function(rslt) {
					printResult(rslt);
					if(rslt != undefined){
						for (var i = 0; i < rslt.length; i++) {
							that.tokenManager.getAccessLogByHash(rslt[i], {from: data.sender, gas:3000000}).then(function(accessLogInfo) {
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
								console.log("Something happens getting a certificate: " + err);
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
				console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.setUser(data.sender, data.userName, data.userNID, {from: data.sender, gas:3000000}).then(function(rslt) {
					printResult(rslt);
					if(rslt != undefined){
						let response = that.responseHolder(jsonData.id);
		    			response.result = {
							block: rslt						
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
				console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.checkExpiration(data.certHash, {from: data.sender, gas:3000000});
				this.tokenManager.isSenderAllowed(data.certHash, {from: data.sender, gas:3000000}).then(function(rslt) {
					if (rslt) {
						that.tokenManager.insertHistory(data.certHash, {from: data.sender, gas:3000000});
						that.tokenManager.getCertByHash(data.certHash, {from: data.sender, gas:3000000}).then(function(certInfo) {
							let response = that.responseHolder(jsonData.id)
							response.result = {
								certHash: certInfo[0],
								issuer: certInfo[1], 
								certType: certInfo[2], 
								certName: certInfo[3],
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
				console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.newCert(data.owner, data.certType, data.certName, data.duration, {from: data.sender, gas:3000000}).then(function(rslt) {
					printResult(rslt);
					if(rslt != undefined){
						let response = that.responseHolder(jsonData.id);
						let newCertEvent = that.tokenManager.newCertCreated({}, {fromBlock: 'latest', toBlock: 'latest'})
						newCertEvent.get((error, logs) => {
							logs.forEach(log => {
								response.result = {
									certHash: log.args.certUnique,
									issuer: log.args.sender,
									certType: log.args.certType,
									certName: log.args.certName,
									creationDate: log.args.creationDate,
									expirationDate: log.args.expirationDate,
									isStilValid: true
								}
								that.sendResponse(response);
							})
						})
					} else {
						console.log("Balance error: "+rslt)
					}
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
    			console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.setNewOwner(data.certHash, data.newOwner, {from: data.sender, gas:3000000}).then(function(rslt) {
					if(rslt != undefined){
						let response = that.responseHolder(jsonData.id);
		    			response.result = {
							block: rslt						
						}
						console.log("Making new owner response")
						that.sendResponse(response);
					}
					else{
						console.log("Balance error: "+rslt)
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
    			console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.setEntityToWhiteList(data.certHash, data.address, {from: data.sender, gas:3000000}).then(function(rslt) {
					if(rslt != undefined){
						let response = that.responseHolder(jsonData.id);
		    			response.result = {
							success: rslt						
						}
						console.log("Making entity to white list response")
						that.sendResponse(response);
					}
					else{
						console.log("Balance error: "+rslt)
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
    			console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.removeCertificate(data.certHash, {from: data.sender, gas:3000000}).then(function(rslt) {
						if(rslt != undefined){
						let response = that.responseHolder(jsonData.id);
		    			response.result = {
							success: rslt						
						}
						console.log("Making entity to white list response")
						that.sendResponse(response);
					}
					else{
						console.log("Balance error: "+rslt)
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

function printResult(rslt) {
	console.log("");
	console.log("###############  Request result  ###############");	
	if (rslt != "") {
		console.log(rslt);
	} else {
		console.log("There isn't results to the request");		
	}
}

function userCreationTest() {

	myContract.methods.setUser(jackAddress, web3.utils.utf8ToHex('Jack Sparrow'), web3.utils.utf8ToHex('66666666J')).send({from: jackAddress})
	.on('transactionHash', function(hash){
		console.log(hash);      	  // Easily catch all errors along the whole execution.
	});

	myContract.methods.setUser(inakiAddress, web3.utils.utf8ToHex('Inaki Seco'), web3.utils.utf8ToHex('22222222A')).send({from: jackAddress})
	.on('transactionHash', function(hash){
		console.log(hash);      	  // Easily catch all errors along the whole execution.
	});

	myContract.methods.newCert(inakiAddress, web3.utils.utf8ToHex('Grado'), web3.utils.utf8ToHex('Teleco'), 120).send({from: jackAddress})
	.on('receipt', function(receipt){
		console.log(receipt);
	})
	.on('transactionHash', function(hash){
		console.log(hash);
		myContract.methods.getCertList(inakiAddress).send({from: inakiAddress})
		.on('transactionHash', function(hash){
			console.log(hash);
		})
		.on('receipt', function(receipt){
			console.log(receipt);
		});
	});

}


exports.CertificateProtocol = CertificateProtocol;
'use strict'

const proto = require('./protocol');

const gethURL = "http://127.0.0.1:9545";

//BEGIN: prepare tools needed to connect to ethereum 
const Web3 = require('web3');
const Accounts = require('web3-eth-accounts');
const contract = require("truffle-contract");

var provider = new Web3.providers.HttpProvider(gethURL);
const web3 = new Web3(provider);
const accounts = new Accounts(gethURL);

console.log("Running web3 version: "+Web3.version);
console.log("Active  Web3 modules: "+JSON.stringify(Web3.modules));

const eth = web3.eth;
const personal = eth.personal;

const CertificateContract = contract(
  require("../../token/build/contracts/CertToken.json")
);

console.log("Provider: "+provider)
console.log("Current provider: "+Web3.currentProvider)
// Remember to set the Web3 provider (see above).
CertificateContract.setProvider(provider);

//BEGIN workaround to fix:  Cannot read property 'apply' of undefined
CertificateContract.currentProvider.sendAsync = function () {
    return CertificateContract.currentProvider.send.apply(CertificateContract.currentProvider, arguments);
};
//END workaround

let inakiAddress = ("0x627306090abaB3A6e1400e9345bC60c78a8BEf57")
let jackAddress = ("0xf17f52151EbEF6C7334FAD080c5704D77216b732")

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
    	console.log("Deploy CertificateContract!");
    	CertificateContract.deployed().then(function(instance) {
			console.log("Contract deployed!");
			that.tokenManager = instance;
			console.log("Creating instance")
			return that.tokenManager.setUser(inakiAddress, "Inaki Seco", "77777777A", {from: inakiAddress, gas:3000000});
		}).then(function(result) {
			console.log("User Inaki creation block: " + JSON.stringify(result));
	    	return that.tokenManager.setUser(jackAddress, "Jack Sparrow", "66666666B", {from: jackAddress, gas:3000000});
	    }).then(function(result) {
	    	console.log("User Jack creation block: " + JSON.stringify(result));
		}).catch(function(err) {
		  	console.log("FULL ERROR! " + err);       	  // Easily catch all errors along the whole execution.
		});
    }

    parse(wsClient, jsonData){
		
		this._client = wsClient;

    	if(!this.isValidMessage(jsonData)){
			let data = jsonData.params;
			let response = this.responseHolder();
			response.jsonrpc = "2.0";
			response.id = data.id;
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
					console.log("###############  Block generated - Info  ###############");	
					console.log(rslt);		
					if(rslt != undefined){
						for (var i = 0; i < rslt.length; i++) {
							that.tokenManager.getCertByHash(rslt[i], {from: data.sender, gas:3000000}).then(function(certInfo) {
								let response = that.responseHolder();
								response.jsonrpc = "2.0";
								response.id = "0.1";
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
						//		response.jsonrpc = "2.0";
						//		response.id = jsonData.id;
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

            case "checkCert":{
				let that = this;
				let data = jsonData.params;
				console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.checkCert(data.certHash, {from: data.sender, gas:3000000}).then(function(rslt) {		// TODO: change "from"
					console.log("###############  Block generated - Info  ###############");	
					console.log(rslt);		
					if(rslt != undefined){
						let response = that.responseHolder();
						let checkOkEvent = that.tokenManager.checkOk({}, {fromBlock: 'latest', toBlock: 'latest'})
						checkOkEvent.get((error, logs) => {
							logs.forEach(log => {
								response.jsonrpc = "2.0";
								response.id = jsonData.id;
								response.result = {
									verification: log.args.success,
									sender: log.args.sender,
									creationDate: log.args.creationDate,
									certHash: log.args.unique
								}
								that.sendResponse(response);
							})
						})
					}
					else{
						console.log("Balance error: "+rslt)
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
					console.log("###############  Block generated - Info  ###############");	
					console.log(rslt);		
					if(rslt != undefined){
						let response = that.responseHolder();
						let newCertEvent = that.tokenManager.newCertCreated({}, {fromBlock: 'latest', toBlock: 'latest'})
						newCertEvent.get((error, logs) => {
							logs.forEach(log => {
								response.jsonrpc = "2.0";
								response.id = jsonData.id;
								response.result = {
									certHash: log.args.unique,
									sender: log.args.sender,
									certType: log.args.certType,
									certName: log.args.certName,
									creationDate: log.args.creationDate,
									expirationDate: log.args.expirationDate						
								}
								that.sendResponse(response);
							})
						})
						
//						let newCertEvent = that.tokenManager.newCertCreated({}, {fromBlock: 0, toBlock: 'latest'})
//						// print all logs from event newCertCreated
//						newCertEvent.get((error, logs) => {
//							logs.forEach(log => console.log(JSON.stringify(log.args)));
//						})				

					}
					else{
						console.log("Balance error: "+rslt)
					}
				}).catch((err) => {
					console.log("Something happens creating new certificate: " + err);
				});	
    			break
			}

			case "setEntityToWhiteList":{
				let that = this;
				let data = jsonData.params;
    			console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.setEntityToWhiteList(data.whiteList, data.allowed, {from: data.sender, gas:3000000}).then(function(rslt) {
						console.log("###############  Block generated - Info  ###############");	
						console.log(rslt);					
						if(rslt != undefined){
						let response = that.responseHolder();
						response.jsonrpc = "2.0";
						response.id = jsonData.id;
		    			response.result = {
							success: "TODO"						
						}
						console.log("Making entity to white list response")
						that.sendResponse(response);
					}
					else{
						console.log("Balance error: "+rslt)
					}
				}).catch((err) => {
					console.log("Something happens adding new entity to white list: " + err);
				});				
    			break
			}
    		default:{
    			wsClient.send("Hello world");
    		}
    	}
	}
}

exports.CertificateProtocol = CertificateProtocol;
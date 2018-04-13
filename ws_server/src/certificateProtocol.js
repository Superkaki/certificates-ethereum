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

const CertificatesContract = contract(
  require("../../token/build/contracts/CertToken.json")
);

console.log("Provider: "+provider)
console.log("Current provider: "+Web3.currentProvider)
// Remember to set the Web3 provider (see above).
CertificatesContract.setProvider(provider);

//BEGIN workaround to fix:  Cannot read property 'apply' of undefined
CertificatesContract.currentProvider.sendAsync = function () {
    return CertificatesContract.currentProvider.send.apply(CertificatesContract.currentProvider, arguments);
};
//END workaround

let charger_address = ("0x627306090abaB3A6e1400e9345bC60c78a8BEf57")
let car_address = ("0xf17f52151EbEF6C7334FAD080c5704D77216b732")

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
    	console.log("Deploy CertificatesContract!");
    	CertificatesContract.deployed().then(function(instance) {
		  console.log("Contract deployed!");
		  that.tokenManager = instance;
		  console.log("Creating instance")
		  return that.tokenManager.balanceOf.call(charger_address);
		}).then(function(result) {
		  console.log("Balance of charger account is " + result);
		  return that.tokenManager.balanceOf.call(car_address);
		}).then(function(result) {
		  console.log("Balance of car account is " + result);
		}).catch(function(err) {
		  // Easily catch all errors along the whole execution.
		  console.log("FULL ERROR! " + err);
		});
    }

    parse(wsClient, jsonData){

		this._client = wsClient;

    	if(!this.isValidMessage(jsonData)){
			let response = this.responseHolder();
			response.payload="Invalid message";
			this.sendResponse(response);
			return;
    	}

    	switch(jsonData.action){
    		case "read_charging_point":{
    			let that = this;
    			console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.balanceOf(charger_address).then(function(result) {
					if(result){
						let response = that.responseHolder();
						response.action = "charger_info_response";
		    			response.payload = {
							available_tokens: result,
							address: charger_address
						}
						that.sendResponse(response);
					}
					else{
						console.log("Balance error: "+result)
					}
				}).catch(function(err) {
				  // Easily catch all errors along the whole execution.
				  console.log("FULL ERROR! " + err);
				});
    			break;
			}
			case "read_car_data":{
    			let that = this;
    			console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.balanceOf(car_address).then(function(result) {
					if(result){
						let response = that.responseHolder();
						response.action = "car_data_response";
		    			response.payload = {
							available_tokens: result,
							address: car_address
						}
						that.sendResponse(response);
					}
				});
    			break
			}
			case "read_minute_price":{
				let that = this;
				let data = jsonData.payload;
				let response = this.responseHolder();
				console.log("this.tokenManager != undefined --> "+(this.tokenManager != undefined));
				this.tokenManager.getMinutePrice().then(function(minutePrice) {
					if(minutePrice!=undefined){
						let response = that.responseHolder();
						response.action = "minute_price_response";
		    			response.payload = {
							minute_price: minutePrice,
							areMinutesChanged: data.areMinutesChanged
						}
						that.sendResponse(response);
					}
				});
    			break
			}
			case "new_arrival":{
				//matricula, minutos, token, info
				let that = this;
				let data = jsonData.payload;
				let response = this.responseHolder();
				console.log("Transfering funds from car to charger...");
				console.log("Transfer from "+car_address+" to "+charger_address+", value "+data.minutes+", info "+data.info)
				this.tokenManager.transferMinutes(car_address, charger_address, data.minutos, data.info, { from: car_address })
					.then(function(result) {
						console.log("Transfer was ok");
						console.log(JSON.stringify(result));
						//Añadimos la linea recharge a la web
						response.action = "new_arrival_response";
						response.payload = {
							matricula: data.matricula,
							minutos: data.minutos+" min",
							token: "-"+data.token + " TT",
							type: "recharge",
							timestamp: new Date(),
						}
						that.sendResponse(response);
						
						if(data.info){		// TODO: En este if tendría que evaluarse "result"
							//Añadimos la linea reward a la web
							console.log("this.tokenManager != undefined --> "+(that.tokenManager != undefined));	
							that.tokenManager.getReward()
								.then((rewardResponse) => {
									if(rewardResponse!=undefined){
										let response = that.responseHolder();
										response.action = "new_reward_response";
										response.payload = {
											matricula: data.matricula,
											minutos: " - ",
											reward: rewardResponse + " TT",
											type: "reward",
											timestamp: new Date(),
										}
										that.sendResponse(response);
										console.log("Reward transfer was ok");
									}
							})
							.catch((error) => {
								console.log("Getting the reward failed");
							});
						}					
				})
				.catch((error) => {
					console.log("Something happens during transaction");
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
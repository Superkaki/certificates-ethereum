'use strict'

const Request = require('request');

class Protocol {

	constructor() {
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
    		case "ping":{
				let data = jsonData.params;
				let response = this.responseHolder();
				response.jsonrpc = "2.0";
				response.id = data.id;
				response.result = {
					result: "pong"
				}
    			this.sendResponse(response);
    			break
    		}
    		case "whoami":{
    			Request(
		            'https://api.ipify.org?format=json',
		            { json: true },
		            (error, response, body) => {
		                if (error) {
		                    this._client.send(error);
		                }
		                else{
		                    this._client.send(JSON.stringify(body));
		                }
		        });
    			break
    		}
    		default:{
    			this._client.send("Hello world");
    		}
    	}
    }

    responseHolder(id){
    	let msg = {
	        jsonrpc: "2.0",
			id: id,
			result: undefined
	    };
	    return msg;
	}
	
	errorResponse(id,errCode,errMsg){
		let response = {
			code: errCode,
			message: errMsg
		};
		let msg = {
	        jsonrpc: "2.0",
			id: id,
			error: response
		};
		
	    this.sendResponse(msg);
	}

    sendResponse(response){
    	if(this._client && response){
			let serializedData = JSON.stringify(response);
			console.log("");
			console.log("----> RESPONSE SENDED: " + serializedData);
			this._client.send(serializedData);
		}
    }

    isValidMessage(message){
    	return message!=undefined && message.method != undefined;
    }
}

exports.Protocol = Protocol;
'use strict'

const Request = require('request');

class Protocol {

	constructor() {
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
    		case "ping":{
    			let response = this.responseHolder();
    			response.payload="pong";
    			this.sendResponse(response);
    			break
    		}
    		case "whoami":{
    			Request(
		            'https://api.ipify.org?format=json',
		            { json: true },
		            (error, response, body) => {
		                if (error) {
		                    wsClient.send(error);
		                }
		                else{
		                    wsClient.send(JSON.stringify(body));
		                }
		        });
    			break
    		}
    		default:{
    			wsClient.send("Hello world");
    		}
    	}
    }

    responseHolder(){
    	let msg = {
	        action: undefined,
	        payload: undefined
	      };
	    return msg;
    }

    sendResponse(response){
    	if(this._client && response){
    		this._client.send(JSON.stringify(response))
    	}
    }

    isValidMessage(message){
    	return message!=undefined && message.action != undefined;
    }
}

exports.Protocol = Protocol;
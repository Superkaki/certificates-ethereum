'use strict'

const WebSocket = require('ws');
const CertificateProtocol = require('./certificateProtocol')

class SocketController {

    constructor(websocketServer) {
        this._websocketServer = websocketServer;
        this._protocol = new CertificateProtocol.CertificateProtocol();
    }

    deploy() {
        this._websocketServer = new WebSocket.Server({
            port: 8080
        });
    }

    open() {
        console.log('ws open');
        this._websocketServer.send('ws open');
    }

    processNewConnection(ws) {
        console.log('client connected');
        this.send(ws, '{"params":"client connected"}');
    }

    processMessage(ws, message) {
        console.log("");
        console.log('REQUEST RECEIVED: %s', message);
        let jsonData = JSON.parse(message);
        this._protocol.parse(ws, jsonData);

        //this.broadcastOthers(ws, "PONG 1");
        //this.broadcastAll("PONG 2");
    }

    send(ws, data) {
        ws.send(data);
    }

    broadcastOthers(wsClient, data) {
        if (data && this._websocketServer && wsClient) {
            // Broadcast to everyone else.
            this._websocketServer.clients.forEach(function each(client) {
                if (client !== wsClient && client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        }
    }

    broadcastAll(data) {
        if (data && this._websocketServer) {
            // Broadcast to everyone, including itself
            this._websocketServer.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        }
    }

    close(wsClient) {
        // close user connection
    }

    listen() {
        let thisSocket = this;

        console.log("Starting WebSocket...");
        
        this._websocketServer.on('open', function open() {
            thisSocket.open();
        });

        this._websocketServer.on('connection', function connection(ws, request) {

            //detect origin
            const ip = request.connection.remoteAddress;
            const ip2 = request.headers['x-forwarded-for'];
            console.log((new Date()) + ' Connection from origin ' + ip + '.');
            if (ip2) {
                console.log((new Date()) + ' Connection forwarded from ' + ip2 + '.');
            }

            //heartbeat function
            let beat = function heartbeat() {
                this.isAlive = true;
            }

            //implement heartbeat
            ws.isAlive = true;
            ws.on('pong', beat);

            ws.on('message', function incoming(message) {
                thisSocket.processMessage(ws, message);
            });
            thisSocket.processNewConnection(ws);

            ws.on('close', function(ws) {
                thisSocket.close(ws);
            });

            ws.on('error', () => console.log('Error encountered!!'));

        });

        //implement heartbeat listener/timer
        const interval = setInterval(function ping() {
            thisSocket._websocketServer.clients.forEach(function each(ws) {
                if (ws.isAlive === false) {
                    console.warn("Closing connection. Reason: no heartbeat");
                    return ws.terminate();
                }
                ws.isAlive = false;
                let noop = function noop() {};
                ws.ping(noop);
            });
        }, 5000);
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    get toString() {
        return `${this._websocketServer}`
    }

    print() {
        console.log(this.toString());
    }
}

exports.SocketController = SocketController;
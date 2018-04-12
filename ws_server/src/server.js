const fs = require('fs');
const storage = require('./connector')
const controller = require('./socketController')

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-ws';

mongoendpoint = new storage.MongoEndpoint();
mongoendpoint.setPersistenceEnabled(false)
mongoendpoint.start();

socketControl = new controller.SocketController();
socketControl.deploy();
socketControl.listen();
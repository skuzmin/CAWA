var express = require('express'),
  	app = express(),
  	path = require('path'),
    http = require('http'),
  	httpServer = http.Server(app),
  	target = '/source',
  	port = 3001,
  	host = 'localhost';
  	
  app.use('/', express.static(path.join(__dirname, target)));
	
  	
  app.listen(port, host);
  console.log('Server is runnig at ' + host + ':' + port + '\nTarget: ' + target); 
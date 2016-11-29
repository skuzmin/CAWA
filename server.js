var express = require('express'),
  	app = express(),
  	path = require('path'),
    http = require('http'),
  	httpServer = http.Server(app),
  	target = '/source',
    bower = '/bower_components',
    images = '/source/app/images',
  	port = 8000,
  	host = 'localhost';
  	
  app.use('/', express.static(path.join(__dirname, target)));
  app.use('/bower_components', express.static(path.join(__dirname, bower)));
	app.use('/images', express.static(path.join(__dirname, images)));
  	
  app.listen(port, host);
  console.log('Server is runnig at ' + host + ':' + port + '\nTarget: ' + target); 
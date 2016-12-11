var express = require('express'),
    app = express(),
    path = require('path'),
    http = require('http'),
    httpServer = http.Server(app),
    target = '/source',
    bower = '/bower_components',
    images = '/source/app/images',
    build = '/public/release'
    port = 8000,
    host = '0.0.0.0';

app.use('/', express.static(path.join(__dirname, target)));
app.use('/bower_components', express.static(path.join(__dirname, bower)));
app.use('/images', express.static(path.join(__dirname, images)));

app.use('/build', express.static(path.join(__dirname, build)));

app.listen(port, host);
console.log('Server is runnig at ' + host + ':' + port + '\nTarget: ' + target);

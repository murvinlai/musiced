/*
 * Simple web server
 */
var express = require('express');

/* handle uncaught exception */
process.on('uncaughtException', function (ex) {
	console.error(ex);
	console.log("UncaughtException: " + ex);
});

// create server
var app = express();

app.set('title', 'Music Application');
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(app.router);

// Listen to port 
app.listen(3000);


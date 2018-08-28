var express 		= require('express');
var bodyParser 		= require('body-parser');
var routes			= require('./routes-apicall');
var redirect 		= require("express-redirect");
var app 			= express();
var passport		= require('passport')
var config 			= require('./config.js');
var session			= require('express-session');

var port = process.env.PORT || 3001;
app.use(session({ secret: 'this-is-a-secret-token',resave: true, saveUninitialized: true, cookie: { maxAge: 60000 }}));
redirect(app);
//global.recentInput = "";
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json());
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');
app.use(routes);

app.use(passport.initialize());
app.use(passport.session());

 app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

global.loggedUsers = {
};
var server = app.listen(port,function(){
	console.log("Application started listening port "+port);		
});



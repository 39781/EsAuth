var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var path			= require("path");	
var aad    			= require('azure-ad-jwt');
var config 			= require('./config');
var botFrameWork	= require('./microsoft/botFrameWork')
var jwtDecode = require('jwt-decode');
//var tokenUrlParams = `redirect_uri=http%3A%2F%2Flocalhost%3A3000&client_id=ef1e541e-365c-477d-9a93-ff8fda666d4b	&code=${req.body.code}&grant_type=authorization_code&client_secret=${client_secrt}`



router.use('/auth',function(req, res, next){
	var channel = req.body.channel;
	console.log(channel);
	if(typeof(req.headers.authorization)=='undefined'){
		res.status(401).send('your are not authorized person to get information. please login to get authorization');
	}else{
		var auth = req.headers.authorization.split(' ');
		if(auth[0] === 'Bearer'){
			validateToken(auth[1],channel)
			.then(function(resp){	
				next();
			})
			.catch(function(err){
				res.status(401).send('your are not authorized person to get information. please login to get authorization');
				
			})
		}else{
			res.status(401).send('your are not authorized person to get information. please login to get authorization');
		}
	}
});
router.post('/auth/callAPI',function(req, res, next){
	res.status(200);
	console.log('test');
	res.send('hello world');
	res.end();
});

var validateToken = function(token,channel){
	
	return new Promise(function(resolve, reject){
		if(channel == 'web'){
			var audi = config.resource,
			issu = config.issuer+'/';
		console.log(audi,issu);
		}
		else if (channel == 'teams'){
			var audi = config.teams.aud,
			issu = config.teams.iss;
		console.log(audi,issu,token);
		}
		var decoded = jwtDecode(token);
		console.log(decoded);
		if(decoded.aud == audi&& decoded.iss == issu){
		console.log(typeof(decoded.unique_name));
			if(typeof(decoded.unique_name)=='undefined'){
				resolve(true);
			}else{
				console.log('name:',decoded.unique_name);
				resolve({username:decoded.unique_name,access_token:token});
			}
		}
		else {
			reject (false);
		}
		/*aad.verify(token, {audience:audi,issuer:issu}, function(err, result) {
			if (result) {
				console.log(result);
				resolve({username:result.unique_name,access_token:token});
			} else {
				console.log(err);
				reject(false);
			}
		});*/
	});
}

module.exports = router;




			
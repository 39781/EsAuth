var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	
var url 			= require('url');	

const key			= require('./testBot.json');
const responses			= require('./utilities/apiResponses.js');

const jwtMiddleware = require('express-jwt')
var jwt 			= require('jsonwebtoken');
var jwksClient 		= require('jwks-rsa');




router.use('/auth0', jwtMiddleware({
  secret: jwksClient.expressJwtSecret({
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
			jwksUri: config.appDet.jwksUri
		  }),   
  audience:config.appDet.audience,
  issuer:config.appDet.issuer,
  algorithms:config.alg
}));

router.use(function (err, req, res, next) {
	console.log(err);
  if (err.name === 'UnauthorizedError'||err) {
    res.status(401).send('your are not authorized person to get information. please login to get authorization');
  }
});


router.post('/auth0/psMicroService', function(req,res){
	console.log(req.method);
	switch(req.method){
		case 'POST':postCall(config.apis[req.body.api],req.body.api,{})
					.then(function(resp){
						return responses.buildResponse(resp);
					})
					.then(function(resp){
						res.status(200);
						res.json(resp).end();
					})
					.catch(function(err){
						res.status(400);
						res.json(err).end();
					})
					break;
		case 'GET':getCall(config.apis[req.body.ai],req.body.api)
				   .then(function(resp){
						return responses.buildResponse(resp);
					})
					.then(function(resp){
						res.status(200);
						res.json(resp).end();
					})
					.catch(function(err){
						res.status(400);
						res.json(err).end();
					})
					break;
	}		
});

var postCall = function(api, apiType, bodyData){
	return new Promise(function(resolve,reject){
		request.post(api, {'json': true,body:bodyData}, (err, httpResponse, body) => {
			if(err){
				console.log('err',err);
				reject(err);
			}else{
				resolve({type:req.body.api,data:body});
			}
		});
	});
}
var getCall = function(api){
	return new Promise(function(resolve,reject){
		request.get(api, {'json': true}, (err, httpResponse, body) => {
			if(err){
				console.log('err',err);
				reject(err);
			}else{
				resolve({type:req.body.api,data:body});
			}
		});
	});
}

  
module.exports = router;



			
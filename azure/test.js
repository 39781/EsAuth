var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var jwtDecode = require('jwt-decode');
var path			= require("path");
var jwt = require('jsonwebtoken');	
var aad     = require('azure-ad-jwt');
//o3vuEBlPl3Vcpn9V7PenDIaXjQDMEC9mbpGOYdLYZzw=
var client_secrt='wRKL8sSkOZMIOo04ECYShI80O3uEz/AHspsfydqheCE=';
client_secrt=encodeURIComponent(client_secrt);
token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IktwSVdSVWxnZmlObGQxRFR4WkFoZTRpTm1rQSIsInR5cCI6IkpXVCIsIng1dCI6IktwSVdSVWxnZmlObGQxRFR4WkFoZTRpTm1rQSJ9.eyJzZXJ2aWNldXJsIjoiaHR0cHM6Ly9zbWJhLnRyYWZmaWNtYW5hZ2VyLm5ldC9hcGFjLyIsIm5iZiI6MTUzNDg0ODc4MCwiZXhwIjoxNTM0ODUyMzgwLCJpc3MiOiJodHRwczovL2FwaS5ib3RmcmFtZXdvcmsuY29tIiwiYXVkIjoiZjZmMTcyMTktMTE5YS00NzJiLTkzYTQtYzYzYWY2MTBmNjVhIn0.LKpDtqJvteCI8WFJyl_Ou7BFhz4lKsRa_uWbgUfu7sYu2r63OfKzqTLbrbRZkq3QbDvX_WsSIyk-lgB9KV3uRBr8DOc44iaVu_YpxHPwVzKYQ-WcnfH60BgQvcvnyKvGtsb7gCY_BRrTZqG33UM9AgmsQ-BKYPl2sHo7lPDis8i8BiZ90bBsLo_UCejjOiZXm4R-v9nZFYxRsPD5bnenjvKS2yGOPSLMk7jW4xyK7F8izicjI1eo-RRMkPH7cUULBs7vsQtL7eNXEGL7xC-rQVcn7CXHhWO0YaLVJHZXIan529ZrwqGZVx42U1pa_7yCe_ftdZ1N2dOVxMgQ46o9LQ';

var decoded = jwtDecode(token);
console.log(decoded);

/*var validateToken = function(token){
	aad.verify(token, {algorithms:['HS256'],issuer:'https://api.botframework.com'}, function(err, result) {
    if (result) {
        console.log(result.unique_name);
    } else {
        console.log("JWT is invalid: " + err);
    }
});
	
}
validateToken(token);*/
module.exports = router;
var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var path			= require("path");	
var aad    			= require('azure-ad-jwt');
var config 			= require('./config');
var botFrameWork	= require('./microsoft/botFrameWork')

//var tokenUrlParams = `redirect_uri=http%3A%2F%2Flocalhost%3A3000&client_id=ef1e541e-365c-477d-9a93-ff8fda666d4b	&code=${req.body.code}&grant_type=authorization_code&client_secret=${client_secrt}`



/*router.use('/auth',function(req, res, next){
	if(typeof(req.headers.authorization)=='undefined'){
		res.status(401).send('your are not authorized person to get information. please login to get authorization');
	}else{
		var auth = req.headers.authorization.split(' ');
		if(auth[0] === 'Bearer'){
			validateToken(auth[1])
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
	console.log('hello world');
	res.status(200);
	res.send('hello world');
	res.end();
});*/

router.post('/teams',botFrameWork.connector.listen());

router.post('/',function(req,res){
	console.log(req.body);
	if(req.body.channelId == 'msteams')
	{		
		if(typeof(loggedUsers[req.body.from.id])=='undefined'){
			loggedUsers[req.body.from.id] =req.headers.authorization.split(' ')[1];
		}
		res.redirect(307,'http://ec2-54-172-70-40.compute-1.amazonaws.com:3000/teams');		
	}
	else{		
		if(typeof(req.body.code)!='undefined'){
			generateToken(req.body.code, req.body.state)
			.then(function(resp){
				console.log(resp);
				req.session.username = resp.username;			
				res.status(200);			
				res.send(loginStatus(resp.msg,resp.username,resp.src));
				res.end();
			})
			.catch(function(err){
				console.log(err);
				res.status(400);
				res.send(loginStatus(err,''));
				res.end();
			});
		}else{
			if(typeof(req.body.result)!='undefined'){
				let src, userId;
				if(typeof(req.body.originalRequest)!='undefined'&&req.body.originalRequest.source == 'google'){
					src = 'google';
					userId = req.body.originalRequest.data.user.userId;
				}else{
					src = 'facebook';
					userId= req.body.sessionId
				}
				//console.log(req.body.result.metadata.intentName,req.body.sessionId,loggedUsers,loggedUsers[req.body.sessionId]);
				if(typeof(loggedUsers[userId])=='undefined'){
					//https://login.microsoftonline.com/70064479-4fe3-4c43-8f71-44208e7c8e74/oauth2/authorize?client_id=ef1e541e-365c-477d-9a93-ff8fda666d4b	&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_mode=form_post&resource=https://graph.microsoft.com&state=12345&prompt=consent&scope=openid&nonce=882773
				let url = `${config.authorizeEndpoint}?client_id=${config.client_id}	&response_type=code&redirect_uri=${encodeURIComponent(config.redirect_uri)}&response_mode=form_post&prompt=consent&scope=${config.scope}&resource=${encodeURIComponent(config.resource)}&state=${userId+'_'+src}`;
					let payload;
					if(src == 'google'){						
						responseObj={
							"data": {
							"google": {			
								"expectUserResponse": true,
								"richResponse": {
								"items": [
								  {
									"simpleResponse": {
									  "displayText": "I am es bot, please login to help you?",
									  "textToSpeech": "I am es bot, please login to help you?"
									}
								  },
								  {
									"simpleResponse": {
									  "displayText": "Menu option will work only after authenticated. After login success, tap menu",
									  "textToSpeech": "Menu option will work only after authenticated. After login success, tap menu"
									}  
								  }							
								],
								"suggestions": [
									{
										"title": "menu"
									}								  
								],
								"linkOutSuggestion": {
									"destinationName": "login",
									"url": "http://ec2-54-172-70-40.compute-1.amazonaws.com:3000/login.html?ur="+encodeURIComponent(url)
								}
							  },		  
							}
						  }
						}	
					}else{						
						responseObj = {
						  "speech": "",		  
						  "messages": [{
							  "type": 4,
							  "platform": 'facebook',
							  "payload": {
								"facebook": {
								  "attachment": {
									"type": "template",
									"payload": {
									  "template_type": "button",
									  "text": "Click login button to proceed",
									  "buttons": [{
										  "type": "web_url",
											"url": url,					
										  "title": "Login",
										  "webview_height_ratio": "tall",
										  "messenger_extensions": "true"
										}]
									}
								  }
								}
							  }
							}
						  ]
						}											
					}										
					res.json(responseObj).end();
				}else{
					request.post('http://ec2-54-172-70-40.compute-1.amazonaws.com:3001/auth/callAPI',{
						'auth': {
						  'bearer': loggedUsers[userId]
						 },
						'json': true,
						'body':{channel:'web'}
						},function(error,response, body){
							console.log('msges',error, response.statusCode, body);	
							if(error){
								msg = "Invalid authentication please login";
							}else{
								if(response.statusCode!=200){
									msg = "Invalid authentication please login";
								}else{
									msg = body;	
								}
								
							}
							console.log('msg',msg);
							if(src != 'google'){
								responseObj = {			
								"speech": "",								
								"messages": [{
								  "type": 0,
								  "platform": 'facebook',
								  "speech": msg
								}]
							}
							}else{
								responseObj ={
									"data": {
										"google": {			
											"expectUserResponse": true,
											"richResponse": {
											"items": [
											  {
												"simpleResponse": {
												  "displayText": msg,
												  "textToSpeech": msg
												}
											  }
											],
											"suggestions": [],								
										  },		  
										}
									}
								}
							}				
							console.log();
							res.json(responseObj).end();
						});			
				}
			}else{
				res.end();
			}
			
			
		}
	}
	
});

var generateToken = function(code,state){
	return new Promise(function(resolve, reject){
		var params = state.split('_');
		let tokenUrlParams =  `client_id=${config.client_id}	&grant_type=${config.grant_type}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&code=${code}&client_secret=${encodeURIComponent(config.client_secret)}`;
		console.log(tokenUrlParams);
		request.post(config.tokenEndpoint,{body:tokenUrlParams},function(error,response,body){
			console.log(error);
			if(error){
				console.log(error);
				reject('technical issue');	
			}else{
				body = JSON.parse(body);
				console.log(body);
				if(typeof(body.access_token)!='undefined'){
					validateToken(body.access_token)
					.then(function(resp){
						if(params[1] == 'google'){
							loggedUsers[params[0]] = resp.access_token;
						}else{
							loggedUsers[resp.username] = resp.access_token;
						}						
						resolve({msg:'User authentication success, welcome : '+resp.username,username:resp.username,src:params[1]});				
					})
					.catch(function(err){
						reject('Not a valid user please login to get authorization');
					})
				}else{
					reject('error in token generation');
				}
			}			
		})
	});
}

var validateToken = function(token){
	return new Promise(function(resolve, reject){
		aad.verify(token, {audience:config.resource,issuer:config.issuer}, function(err, result) {
			if (result) {
				console.log(result);
				resolve({username:result.unique_name,access_token:token});
			} else {
				console.log(err);
				reject(false);
			}
		});
	});
}
var currentTime =function(){
	var currentDate = new Date();
	var hours = (currentDate.getHours() < 10) ? '0' + currentDate.getHours() : currentDate.getHours();
	var minutes = (currentDate.getMinutes() < 10) ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';

	return `${hours}:${minutes} ${ampm}`;
}
var loginStatus = function(payloadText,uname,src){	
		let html = '<li class="list-group-item background-color-custom"><div class="media-body bot-txt-space animated fadeInLeft">             <p class="list-group-item-text-bot">'+payloadText+'</p><p class="bot-res-timestamp"><small> <img style="border-radius:50%;border:2px solid white;" width="20" height="20" src="'+config.botAvatar+'"/>'+currentTime()+'</small></p></div></li>';		
		var scriptCode = "<script>window.opener.postMessage({'msg':'"+html+"' , 'uname': '"+uname+"'}, 'http://ec2-54-172-70-40.compute-1.amazonaws.com:3000');window.close();</script>";
	return scriptCode;
}

module.exports = router;




			
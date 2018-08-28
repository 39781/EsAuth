'use strict';

var config = require('./../config');
console.log('config',config.MICROSOFT_APP_ID);
var request = require("request");
const builder = require('botbuilder'),

    apiairecognizer = require('api-ai-recognizer');
   // responseTemplates = require('./../response');

// Bot Storage: Here we register the state storage for your bot.
//var inMemoryStorage = new builder.MemoryBotStorage();

var microsoft = {
    //create chat bot and listen to messages
    connector: new builder.ChatConnector({
        appId: config.MICROSOFT_APP_ID,
        appPassword: config.MICROSOFT_APP_PASSWORD
    })
};

var bot = new builder.UniversalBot(microsoft.connector,{
    storage: new builder.MemoryBotStorage()
}),
    recognizer = new apiairecognizer(config.clienAccessToken),
    intents = new builder.IntentDialog({
        recognizers: [recognizer]
    });

bot.dialog('/', intents);

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});

intents.matches('Default Fallback Intent', (session, args) => {
	    console.log("args ", session.message.address.channelId);
	calApi(session.message.user.id)
	.then(function(resp){
		session.send(resp);
	})
	   
});

intents.matches('login', (session, args) => {
	console.log(session.message);
		
	
	
    console.log("args ", session.message.address.channelId);   
	calApi(session.message.user.id)
	.then(function(resp){
		session.send(resp);
	})
		
});
var calApi = function(userId){
	return new Promise(function(resolve, reject){
	console.log(userId,loggedUsers[userId]);
	let msg="";
		request.post('http://ec2-54-172-70-40.compute-1.amazonaws.com:3001/auth/callAPI',{
			'auth': {
			  'bearer': loggedUsers[userId]
			 },
			'json': true,
			'body':{channel:'teams'}
			},function(error,response, body){
				console.log(error, response.statusCode, body);	
				if(error){
					msg = "Invalid authentication please login";
				}else{
					if(response.statusCode!=200){
						msg = "Invalid authentication please login";
					}else{
						msg = body;	
					}
					
				}
			resolve(msg);
		});
	});
}
intents.onDefault(function (session) {
    session.send("Sorry...can you please rephrase?");
});

module.exports = microsoft;

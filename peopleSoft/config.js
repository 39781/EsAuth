module.exports = {
	apis:{
		'leavebalance':'http://ps92dmo.hexaware.com:8080/PSIGW/RESTListeningConnector/PSFT_HR/HX_LMS_BOT_ABS_DTLS_RST.v1/KU0097'
	},
	appDet:{
		"domainName":"exeter.auth0.com",
		"audience":'https://exeter.auth0.com/api/v2/',				
		'issuer':'https://exeter.auth0.com/',
		'jwksUri':'https://exeter.auth0.com/.well-known/jwks.json',
		'alg':['RS256']
	},	
	responseObj: {
	  "payload": {
		"google": {			
		  "expectUserResponse": true,
		  "richResponse": {
			"items": [],
			"suggestions":[]
		  },		  
		}
	  }
	}	
}



